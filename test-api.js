const testLogin = async () => {
    try {
        const response = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'asha@demo.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('✅ Login Test:', response.status === 200 ? 'PASSED' : 'FAILED');
        console.log('Response:', data);

        if (data.token) {
            console.log('\n🔑 Token received successfully!');
            return data.token;
        }
    } catch (error) {
        console.error('❌ Login Test FAILED:', error);
    }
};

const testAIAnalysis = async () => {
    try {
        const response = await fetch('http://localhost:4000/ai/analyze-symptoms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symptoms: 'fever, headache, mild cough'
            })
        });

        const data = await response.json();
        console.log('\n✅ AI Analysis Test (Minor):', response.status === 200 ? 'PASSED' : 'FAILED');
        console.log('Severity:', data.severity);
        console.log('Urgency:', data.urgency);
        console.log('Recommendations:', data.recommendations);
        console.log('Requires Doctor:', data.requiresDoctorConsultation);
    } catch (error) {
        console.error('❌ AI Analysis Test FAILED:', error);
    }
};

const testSevereSymptoms = async () => {
    try {
        const response = await fetch('http://localhost:4000/ai/analyze-symptoms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symptoms: 'chest pain, difficulty breathing'
            })
        });

        const data = await response.json();
        console.log('\n✅ AI Analysis Test (Severe):', response.status === 200 ? 'PASSED' : 'FAILED');
        console.log('Severity:', data.severity);
        console.log('Urgency:', data.urgency);
        console.log('Recommendations:', data.recommendations);
        console.log('Requires Doctor:', data.requiresDoctorConsultation);
    } catch (error) {
        console.error('❌ Severe Symptoms Test FAILED:', error);
    }
};

const runTests = async () => {
    console.log('🧪 Starting JanJeevan API Tests...\n');
    console.log('='.repeat(50));

    await testLogin();
    await testAIAnalysis();
    await testSevereSymptoms();

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed!');
    console.log('\n📱 Frontend is running at: http://localhost:3000');
    console.log('🔧 Backend is running at: http://localhost:4000');
    console.log('\n👉 Open http://localhost:3000 in your browser to test the UI!');
};

runTests();
