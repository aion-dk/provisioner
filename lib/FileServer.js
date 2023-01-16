class FileServer {
  static token = "f9403fc5f537b4ab332d";
  static baseUrl = "http://upload-server:25478"

  static genUrl(fileName) {
    return `${this.baseUrl}/files/${fileName}?token=${this.token}`;
  }
}

exports.FileServer = FileServer;
