# hcep-pdf-server

hcep-pdf-server is simple and fast rendering PDF server using Headless Chrome & Express & Puppeteer.


Headless Chrome
<https://developers.google.com/web/updates/2017/04/headless-chrome>

Puppeteer
<https://github.com/GoogleChrome/puppeteer>

Express
<http://expressjs.com/>


## Getting Started

### Caution
Since error control and security measures are minimum, please accept only reliable requests. It does not assume direct disclosure to the outside.


### Clone
git clone this repository.


### (optionary) Install fonts
If you convert pages in Japanese, Chinese or languages other than English, you will need to install a separate font file. Also, you can use WEB fonts, but since it takes a long time for requesting and downloading them, we recommend that install the font files in the server.


```
cp AnyFonts.ttf ./fonts/
```


### Build image

```
sudo docker build -t hcep-pdf-server:latest .
```

### Run

Below example, run with 8000 port.

```
sudo docker run -it --rm \
    -p 8000:8000 \
    --name hcep-pdf-server \
    hcep-pdf-server:latest
```

## Example

### Get request with url parameter

```
curl "http://localhost:8000?url=http://example.com" -o hcep-pdf-get.pdf
```

### POST request with html parameter

```
curl -sS http://localhost:8000 -v -d html=hcep-pdf-ok -o hcep-pdf-post.pdf
```

Please note that when sending html in POST method, you can not use a relative path because the page does not have a URL.

So, you need to include external files with absolute URL.

Bad, not working
```
<link href="/static/style.css" rel="stylesheet">
```

OK

```
<link href="http://example.com/static/style.css" rel="stylesheet">
```

## Customize PDF options
You can customize PDF with options. Read the puppeteer API's docs.

<https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions>

## Author
uyamazak: https://github.com/uyamazak/

blog: http://uyamazak.hatenablog.com/
