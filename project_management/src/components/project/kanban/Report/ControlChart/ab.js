const promise = new Promise((resolve,reject) => {
    let success = true;
    if (success)
    {
        resolve("DONE");
    }
    else {
        reject("FAILED");
    }
})