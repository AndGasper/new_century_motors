const fs = require('fs');

// fs.open(argv[2], 'r', (error, fileDescriptor) => {
//     if (error) {
//         if (error.code === 'ENOENT') {
//             console.error('file does not exist');
//             return;
//         }

//         throw error;
//     }

// });

const fileData = fs.readFileSync(process.argv[2], {'encoding': 'utf-8', 'flag': 'r'});
console.log(fileData);
