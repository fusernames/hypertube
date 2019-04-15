const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const express = require('express');

var app = express();

app.get("/mkv", (req, res) => {
    var videoPath = req.query.path;
    try {
        if (fs.existsSync(videoPath)) {
            var stream = fs.createReadStream(videoPath);
            ffmpeg()
                .input(stream)
                .outputFormat('mp4')
                .on('error', console.error)
                .inputFormat('mkv')
                .audioCodec('aac')
                .videoCodec('libx264')
                .pipe(res)
        } else {
            res.status(404).send();
        }
    } catch (err) {
        console.log("Error, unknown file -> " + videoPath);
    }
})

app.listen(8080);