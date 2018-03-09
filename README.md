# fb-video-uploader

FB Video Uploader uploads videos to your Facebook Ad Account directly from the browser using the [chunked upload](https://developers.facebook.com/docs/marketing-api/advideo/v2.12) strategy.

## Install

```bash
npm install fb-video-uploader --save
```

## Usage
```javascript
import fbVideoUploader from "fb-video-uploader";

async function handleInputChange(e) {
	e.preventDefault();

	const file = e.target.files[0];
	const adAccountId = <ad account>;
	const providerToken = <auth token>;
	
	fb.config({
	  adAccountId: adAccountId,
	  providerToken: providerToken,
	  debug: 1,
	})
	
	const videoId = await fbVideoUploader.upload(file);
}
```

```html
<input type="file" onchange="handleInputChange">
```

## Contributing Guide

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Change Log

See [CHANGELOG.md](CHANGELOG.md)

## License

See [LICENSE](LICENSE)

