(function () {
    fetch('https://bi-assets.s-nbcnews.com/bi-switch/environments1.json')
        .then((response) => response.json())
        .then((data) => {
            const envs = data || {}
            const thisEnvId = _satellite.environment.id;
            const envInfo = envs.filter((item) => { return item.id === thisEnvId });
            console.log('*** Env Info: %O', envInfo[0]);
        })
})()
