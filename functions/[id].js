/**
 * @param {string} slug
 */
import page404 from './404.html'

// const geoip = require('geoip-lite');

// import Geoip from 'geoip-lite';

export async function onRequestGet(context) {
    const { request, env, params } = context;
    // const url = new URL(request.url);
    const clientIP = request.headers.get("CF-Connecting-IP");
    const userAgent = request.headers.get("user-agent");
    const Referer = request.headers.get('Referer') || "Referer"
    const originurl = new URL(request.url);
    // 创建 URLSearchParams 对象，包含查询字符串
    const queryParams = originurl.searchParams;
    // 提取参数
    const kid = queryParams.get('kid'); // 获取 kid 参数的值
    const src = queryParams.get('src'); // 获取 src 参数的值
    const act = queryParams.get('act'); // 获取 act 参数的
    const options = {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const timedata = new Date();
    const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(timedata);

    const slug = params.id;

    const Url = await env.DB.prepare(`SELECT url FROM links where suffix = '${slug}'`).first()

    if (!Url) {
        return new Response(page404, {
            status: 404,
            headers: {
                "content-type": "text/html;charset=UTF-8",
            }
        });
    } else {
        // const ip_location = geoip.lookup(clientIP);
        const ip_location = await getGeoLocation(clientIP);
        console.log(ip_location);
        // getGeoLocation(clientIP).then(location => {
        //     if (location) {
        //         console.log(location);
        //         ip_location = location;
        //     }
        //   });
        try {
            const info = await env.DB.prepare(`INSERT INTO logs (url, kid, src, act, suffix, ip, ip_location, referer,  ua, create_time) 
            VALUES ('${Url.url}', '${kid}', '${src}', '${act}', '${slug}', '${clientIP}', '${ip_location}', '${Referer}', '${userAgent}', '${formattedDate}')`).run()
            // console.log(info);
            return Response.redirect(Url.url, 302);
            
        } catch (error) {
            console.log(error);
            return Response.redirect(Url.url, 302);
        }
    }

}

async function getGeoLocation(ip) {
    return new Promise(async (resolve,reject) => {
        const apiUrl = `https://ipinfo.io/${ip}/json`;
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          resolve(data?.region || '')
        } catch (error) {
          console.error('Error fetching geolocation:', error);
          resolve('')
        }
    })
    
  }