import {FastifyInstance} from 'fastify'
import path from "path";

export default (fastify: FastifyInstance, opts, done) => {


    const io = fastify.io
    fastify.post('/api/upload', function (req, res) {
        let sampleFile;
        let uploadPath;

        if (!req.raw.files || Object.keys(req.raw.files).length === 0) {
            res.status(400).send('No files were uploaded.');
            return;
        }

        console.log('req.files >>>', req.raw.files); // eslint-disable-line

        sampleFile = req.raw.files.file;


        const imageName = sampleFile.name.split('.')[0]
        const vendorCodeParts = imageName.split('_')
        vendorCodeParts.pop()
        vendorCodeParts.pop()
        const vendorCode = vendorCodeParts.join('_')
        uploadPath = path.join(process.cwd(), '..', '..', '..', 'printman-uploads', 'goods-images', vendorCode, sampleFile.name)

        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            }

            res.send(`/goods-images/${vendorCode}/${sampleFile.name}`);
        });

    });
    done()
}
