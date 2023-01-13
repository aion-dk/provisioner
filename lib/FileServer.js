class FileServer {
  static token = "f9403fc5f537b4ab332d";

  static genUrl(fileName) {
    return `http://localhost:25478/files/${fileName}?token=${this.token}`;
  }
}

exports.FileServer = FileServer;
