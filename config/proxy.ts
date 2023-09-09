const env = (process.env.UMI_ENV || '').replace(/^_/, "");

let suffix = '';
if (env === 'prod') { 
  suffix = '';
} else if (env === 'local') {
  suffix = '-dev';
} else {  
  suffix = `-${env}`
}

const targetHost = `https://api${suffix}.ruijiandata.com`;

export default {
  '/api': {
    target: targetHost,
    changeOrigin: true,
    'pathRewrite': { '^/api' : '' },
  },
};
