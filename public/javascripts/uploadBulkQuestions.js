document.getElementById('question-create-bulk').addEventListener('submit', async function (e) {
    e.preventDefault();
    const fileInput = document.getElementById('questionsBulkInput');
    const examId = document.getElementById('examId').value;
    const file = fileInput.files[0];

    try {
        const resp = await file.arrayBuffer();
        const data = new Uint8Array(resp);

        const workbook = XLSX.read(data, { type: 'array' });
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        const questions = jsonData.map(question => {
            return {
                name: ''.trim.call(question.QUESTION),
                options: {
                    A: ''.trim.call(question.A),
                    B: ''.trim.call(question.B),
                    C: ''.trim.call(question.C),
                    D: ''.trim.call(question.D)
                },
                correctAnswer: ''.trim.call(question.ANSWER),
                exam: examId
            }
        })

        await fetch(`${window.location.origin}/staff/dashboard/exams/${examId}/question/bulk`, {
            method: 'POST',
            body: JSON.stringify(questions),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // to show the new data
        window.location.reload();
    } catch (error) {
        console.log(error);
        // figure out how to use the alert in this code
    }
})