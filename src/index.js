import request from './request';

module.exports = {
  debug: 0,
  adAccountId: null,
  providerToken: null,
  formData: null,

  log(data) {
    this.debug && console.log(data);
  },

  config(params) {
    this.adAccountId = params.adAccountId;
    this.providerToken = params.providerToken;
    this.debug = params.debug;
    this.url = 'https://graph-video.facebook.com/v2.11/' + this.adAccountId + '/advideos';
  },

  async upload(file, title) {
    this.log(file);

    delete this.formData;
    this.formData = new FormData();
    this.formData.set('access_token', this.providerToken);

    const startResponse = await this.start(file.size);
    const transferResponses = await this.transfer(file, startResponse.start_offset, startResponse.end_offset);
    const finishResponse = await this.finish(title);

    return finishResponse.success ? startResponse.video_id : null;
  },

  async start(fileSize) {
    this.formData.set('upload_phase', "start");
    this.formData.set('file_size', parseInt(fileSize, 10));

    const response = await request("post", this.url, this.formData);
    this.formData.set('upload_session_id', response.upload_session_id);

    this.log(response);

    return response;
  },

  async transfer(file, start_offset, end_offset) {
    this.formData.delete('file_size');

    const responses = [];

    start_offset = parseInt(start_offset, 10);
    end_offset = parseInt(end_offset, 10);

    this.formData.set('upload_phase', "transfer");

    while(start_offset < end_offset) {
      const blob = file.slice(start_offset, end_offset + 1);

      this.log(blob);
      this.formData.set('start_offset', start_offset);
      this.formData.set('video_file_chunk', blob);

      const response = await request("post", this.url, this.formData);
      start_offset = parseInt(response.start_offset, 10);
      end_offset = parseInt(response.end_offset, 10);
      responses.push(response);

      this.log(response);
    }

    return responses;
  },

  async finish(title) {
    this.formData.delete('start_offset');
    this.formData.delete('video_file_chunk');
    this.formData.set('upload_phase', "finish");
    title && this.formData.set('title', title);

    const response = await request("post", this.url, this.formData);
    this.log(response);

    return response;
  }
}
