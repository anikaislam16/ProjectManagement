const checkSession = async () => {
    const response = await fetch('http://localhost:3010/signup/loginmatch', {
        method: "GET",
        credentials: 'include', // Include cookies
    });

    if (response.ok) {
        console.log("success");
        const data = await response.json();
        console.log(data.message);
        console.log(data);
        if (data.message === 'No session found') {
            const response = await fetch('http://localhost:3010/signup/login', {
                method: "PUT",
                credentials: 'include', // Include cookies
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message)
                if (data.message === 'No session found') {
                    const datasend = { message: "Session Expired" }
                    return datasend;
                    // navigate('/login', { state: datasend });
                }
                else {
                    console.log(data.user);
                    return data.user;
                }
            }
        }
        else {
            console.log(data.user);
            const val = data.user;
            return val;
        }
    }
}
module.exports = { checkSession }