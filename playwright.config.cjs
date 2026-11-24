const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');

const browserEnv={...process.env};
// Chromium 134 in the managed Linux image crashes in its native fontconfig
// fallback for the installed OpenAI Sans WOFF2 files. Keep the workaround
// scoped to this test browser and only enable it when that known trigger exists.
if(process.platform==='linux'&&fs.existsSync('/usr/share/fonts/openai-sans/OpenAISans-Regular.woff2'))
 browserEnv.FONTCONFIG_FILE=path.join(__dirname,'tests/fixtures/linux-cjk-fonts.conf');

const fallbackShell='/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell';
let executablePath;
try{
 const defaultExec=chromium.executablePath();
 if((!defaultExec||!fs.existsSync(defaultExec))&&fs.existsSync(fallbackShell))executablePath=fallbackShell;
}catch{
 if(fs.existsSync(fallbackShell))executablePath=fallbackShell;
}

module.exports={
 testDir:'./tests',timeout:60000,workers:1,
 webServer:{command:'npm run serve',url:'http://127.0.0.1:8080',reuseExistingServer:!process.env.CI,timeout:30000},
 use:{baseURL:'http://127.0.0.1:8080',headless:true,launchOptions:{
  ...(executablePath?{executablePath}:{}),
  args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-webgl'],env:browserEnv
 }},
 reporter:[['list'],['json',{outputFile:'test-results/results.json'}]]
};
