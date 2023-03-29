module.exports = {
    apps: [
        {
            name: 'nuxt_blog',
            exec_mode: 'cluster',
            instances: '1',
            script: './.output/server/index.mjs',
            args: 'start',
            port: 3001
        },
    ],
};
