// Hàm tải file JS chứa dữ liệu cấu trúc đáp án linh hoạt
function loadExamData() {
    const selectedExam = document.getElementById("exam-select").value;
    
    // Nếu dữ liệu mã đề này chưa được tải về trang trước đó
    if (!examAnswers[selectedExam]) {
        document.getElementById("exam-title-text").innerText = "Đang tải tệp dữ liệu đáp án...";
        
        // Tạo thẻ script động để nạp dữ liệu từ tệp tin bên ngoài (Giải quyết triệt để lỗi CORS cục bộ)
        const script = document.createElement("script");
        script.src = `data/${selectedExam}.js`;
        script.onload = function() {
            initForm(selectedExam);
        };
        script.onerror = function() {
            document.getElementById("exam-title-text").innerText = "Lỗi: Không tìm thấy tệp dữ liệu đáp án cho mã này!";
        };
        document.head.appendChild(script);
    } else {
        initForm(selectedExam);
    }
}

// Hàm khởi tạo cây cấu trúc Form
function initForm(examId) {
    const currentExam = examAnswers[examId];
    document.getElementById("exam-title-text").innerText = currentExam.examName;
    document.getElementById("result-board").style.display = "none";
    document.getElementById("submit-btn").disabled = false;
    document.getElementById("submit-btn").style.display = "block";
    document.getElementById("reset-btn").style.display = "none";

    // 1. Dựng Phần I (12 câu trắc nghiệm đơn)
    let p1Html = '';
    const optionsP1 = ['A', 'B', 'C', 'D'];
    for (let i = 1; i <= 12; i++) {
        p1Html += `
        <div class="q-wrapper">
            <div class="q-row">
                <div class="q-num">Câu ${i}:</div>
                <div class="options">`;
        for (let opt of optionsP1) {
            p1Html += `
                    <label class="bubble-container">
                        <input type="radio" name="p1_q${i}" value="${opt}">
                        <span class="bubble" id="p1_q${i}_${opt}">${opt}</span>
                    </label>`;
        }
        p1Html += `
                </div>
            </div>
            <button type="button" class="explanation-toggle-btn" id="btn_exp_p1_q${i}" onclick="toggleExplanation('p1_q${i}')">Xem lời giải</button>
            <div class="explanation-box" id="box_exp_p1_q${i}"></div>
        </div>`;
    }
    document.getElementById("p1-content").innerHTML = p1Html;

    // 2. Dựng Phần II (4 câu Đúng/Sai, mỗi câu 4 ý a,b,c,d)
    let p2Html = '';
    const labelsP2 = ['a', 'b', 'c', 'd'];
    for (let i = 1; i <= 4; i++) {
        p2Html += `
        <div class="tf-box">
            <div class="tf-header">Câu ${i}:</div>`;
        for (let j = 0; j < 4; j++) {
            p2Html += `
            <div class="tf-row">
                <div class="tf-label">${labelsP2[j]})</div>
                <div class="tf-options">
                    <label class="bubble-container">
                        <input type="radio" name="p2_q${i}_${labelsP2[j]}" value="Đ">
                        <span class="bubble" id="p2_q${i}_${labelsP2[j]}_Đ">Đ</span>
                    </label>
                    <label class="bubble-container">
                        <input type="radio" name="p2_q${i}_${labelsP2[j]}" value="S">
                        <span class="bubble" id="p2_q${i}_${labelsP2[j]}_S">S</span>
                    </label>
                </div>
            </div>`;
        }
        p2Html += `
            <button type="button" class="explanation-toggle-btn" id="btn_exp_p2_q${i}" onclick="toggleExplanation('p2_q${i}')">Xem lời giải</button>
            <div class="explanation-box" id="box_exp_p2_q${i}"></div>
        </div>`;
    }
    document.getElementById("p2-content").innerHTML = p2Html;

    // 3. Dựng Phần III (6 câu điền đáp án ngắn)
    let p3Html = '';
    for (let i = 1; i <= 6; i++) {
        p3Html += `
        <div class="q-wrapper" style="border: 1px solid #e2e8f0; padding: 15px; margin-bottom: 5px; border-radius: 6px;">
            <div class="short-ans-box">
                <div class="q-num" style="width: 80px;">Câu ${i}:</div>
                <input type="text" id="p3_q${i}" autocomplete="off" placeholder="Nhập đáp số">
            </div>
            <button type="button" class="explanation-toggle-btn" id="btn_exp_p3_q${i}" onclick="toggleExplanation('p3_q${i}')">Xem lời giải</button>
            <div class="explanation-box" id="box_exp_p3_q${i}"></div>
        </div>`;
    }
    document.getElementById("p3-content").innerHTML = p3Html;
}

// Khởi chạy nạp đề mặc định khi mở trang web
window.onload = loadExamData;

// Hàm đóng mở ẩn hiện khung lời giải chi tiết
function toggleExplanation(id) {
    const box = document.getElementById(`box_exp_${id}`);
    const btn = document.getElementById(`btn_exp_${id}`);
    if (box.style.display === "block") {
        box.style.display = "none";
        btn.innerText = "Xem lời giải";
    } else {
        box.style.display = "block";
        btn.innerText = "Ẩn lời giải";
    }
}

// Hàm tính và chấm điểm tổng hợp
function calculateScore() {
    // THẦY CÔ DÁN LINK WEB APP CỦA GOOGLE SCRIPT VÀO ĐÂY:
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxJ_vhe8_dOfbY0VLIh_YOmznlPsz5gREAWhpkiX9T2yMUyYZeVMmMQDmKehq2XqNl6/exec"; 

    const studentName = document.getElementById("student-name").value.trim();
    if (studentName === "") {
        alert("Em vui lòng nhập Họ và Tên trước khi nộp bài nhé!");
        return;
    }

    const selectedExam = document.getElementById("exam-select").value;
    const correctData = examAnswers[selectedExam];
    
    let p1Score = 0, p2Score = 0, p3Score = 0;
    
    // Các mảng lưu trữ lỗi sai
    let wrongP1 = [];
    let wrongP2 = [];
    let wrongP3 = [];

    // Chấm Phần I
    for (let i = 1; i <= 12; i++) {
        const item = correctData.part1[i - 1];
        const correctAns = item.ans;
        const selected = document.querySelector(`input[name="p1_q${i}"]:checked`);
        
        document.getElementById(`p1_q${i}_${correctAns}`).classList.add('correct-ans');

        if (selected) {
            if (selected.value === correctAns) {
                p1Score += 0.25;
            } else {
                document.getElementById(`p1_q${i}_${selected.value}`).classList.add('wrong-ans');
                wrongP1.push(`Câu ${i}`); // Lưu lại câu sai
            }
        } else {
            wrongP1.push(`Câu ${i} (Bỏ trống)`);
        }
        renderExplanationBox(`p1_q${i}`, `Đáp án đúng: ${correctAns}`, item.exp, item.image, item.video);
    }

    // Chấm Phần II
    const p2ScoreMap = { 0: 0, 1: 0.1, 2: 0.25, 3: 0.5, 4: 1.0 };
    const labelsP2 = ['a', 'b', 'c', 'd'];
    for (let i = 1; i <= 4; i++) {
        const item = correctData.part2[i - 1];
        const trueAnsArray = item.ans; 
        let correctCount = 0;
        let wrongDetailsP2 = [];

        for (let j = 0; j < 4; j++) {
            const correctAns = trueAnsArray[j];
            const selected = document.querySelector(`input[name="p2_q${i}_${labelsP2[j]}"]:checked`);

            document.getElementById(`p2_q${i}_${labelsP2[j]}_${correctAns}`).classList.add('correct-ans');

            if (selected) {
                if (selected.value === correctAns) {
                    correctCount++;
                } else {
                    document.getElementById(`p2_q${i}_${labelsP2[j]}_${selected.value}`).classList.add('wrong-ans');
                    wrongDetailsP2.push(labelsP2[j]); // Lưu lại ý sai (a, b, c, hoặc d)
                }
            } else {
                wrongDetailsP2.push(`${labelsP2[j]}(trống)`);
            }
        }
        p2Score += p2ScoreMap[correctCount];
        if (wrongDetailsP2.length > 0) {
            wrongP2.push(`Câu ${i} (Sai ý: ${wrongDetailsP2.join(', ')})`);
        }

        let headerAnsText = `Đáp án đúng: a) ${trueAnsArray[0]} | b) ${trueAnsArray[1]} | c) ${trueAnsArray[2]} | d) ${trueAnsArray[3]}`;
        renderExplanationBox(`p2_q${i}`, headerAnsText, item.exp, item.image, item.video);
    }

    // Chấm Phần III
    for (let i = 1; i <= 6; i++) {
        const item = correctData.part3[i - 1];
        const correctAns = item.ans;
        const inputField = document.getElementById(`p3_q${i}`);
        let inputVal = inputField.value.trim().replace(',', '.'); 

        if (inputVal === correctAns) {
            p3Score += 0.5;
            inputField.classList.add('input-correct');
        } else {
            inputField.classList.add('input-wrong');
            wrongP3.push(`Câu ${i}`);
        }
        renderExplanationBox(`p3_q${i}`, `Đáp số đúng: ${correctAns}`, item.exp, item.image, item.video);
    }

    // Tổng hợp điểm
    const totalScore = (p1Score + p2Score + p3Score).toFixed(2);
    document.getElementById("score-p1").innerText = p1Score.toFixed(2);
    document.getElementById("score-p2").innerText = p2Score.toFixed(2);
    document.getElementById("score-p3").innerText = p3Score.toFixed(2);
    document.getElementById("score-total").innerText = totalScore;
    
    // --- GỬI DỮ LIỆU VỀ GOOGLE SHEETS ---
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.innerText = "ĐANG GỬI DỮ LIỆU...";
    submitBtn.disabled = true;

    const payload = {
        name: studentName,
        examId: selectedExam,
        totalScore: totalScore,
        wrongP1: wrongP1.length > 0 ? wrongP1.join(", ") : "Không sai",
        wrongP2: wrongP2.length > 0 ? wrongP2.join("; ") : "Không sai",
        wrongP3: wrongP3.length > 0 ? wrongP3.join(", ") : "Không sai"
    };

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Bỏ qua lỗi CORS khi gửi từ trang tĩnh
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(() => {
        // Hoàn tất và hiện bảng điểm
        document.getElementById("result-board").style.display = "block";
        const allInputs = document.querySelectorAll('input');
        allInputs.forEach(input => input.disabled = true);
        const allToggleBtns = document.querySelectorAll('.explanation-toggle-btn');
        allToggleBtns.forEach(btn => btn.style.display = "block");
        submitBtn.style.display = "none";
        document.getElementById("reset-btn").style.display = "block";
        document.getElementById("result-board").scrollIntoView({ behavior: 'smooth' });
    }).catch(error => {
        alert("Có lỗi khi gửi dữ liệu về máy chủ, nhưng điểm số của em vẫn đã được chấm. Vui lòng báo cho giáo viên.");
        console.error(error);
    });
}

// Hàm kết xuất cấu trúc HTML cho ô lời giải (Hỗ trợ nhúng Ảnh & Video)
function renderExplanationBox(id, correctHeader, textExp, imgPath, videoPath) {
    let box = document.getElementById(`box_exp_${id}`);
    let mediaHtml = '';

    // Kiểm tra và nhúng file ảnh nếu đường dẫn không trống
    if (imgPath && imgPath.trim() !== "") {
        mediaHtml += `<div class="media-container"><img src="${imgPath}" alt="Hình vẽ minh họa câu hỏi"></div>`;
    }

    // Kiểm tra và nhúng file video nếu đường dẫn không trống
    if (videoPath && videoPath.trim() !== "") {
        mediaHtml += `
        <div class="media-container">
            <video width="400" controls>
                <source src="${videoPath}" type="video/mp4">
                Trình duyệt của bạn không hỗ trợ định dạng video.
            </video>
        </div>`;
    }

    box.innerHTML = `<strong>${correctHeader}</strong><br><p style="margin:5px 0;">${textExp}</p>${mediaHtml}`;
}

// Hàm đặt lại trạng thái làm mới form
function resetForm() {
    const selectedExam = document.getElementById("exam-select").value;
    initForm(selectedExam);
}
