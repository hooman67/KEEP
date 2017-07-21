import * as spritesmith from 'spritesmith';
import * as fse from 'fs-extra';
import * as layout from 'layout';
import * as path from 'path';

const generateImages = (files) => {
  return new Promise((resolve, reject) => {
    spritesmith.run(
      {
        src: files,
        algorithm: 'left-right-wrap',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });
};

// TODO: ROOT PATH SHOULD BE IN AZURE BLOCK?
export const spriteSheetsGenerator = async (rootPath: string, outputName: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if path exist and if it is a directory
      const dirPath = path.join(path.resolve(__dirname), rootPath);
      if (!await fse.exists(dirPath) || !(await fse.lstat(dirPath)).isDirectory()) {
        reject(new Error('ERROR_PATH_ERROR'));
      }

      // Iterate through folder and find all file, check file extension.
      const srcArray: string[] = [];
      for (const image of await fse.readdir(dirPath)) {
        if (['.jpeg', '.png', '.jpg'].includes(path.extname(image))) {
          srcArray.push(path.join(path.resolve(__dirname), rootPath, image));
        }
      }
      if (srcArray.length === 0) {
        reject(new Error('ERROR_DIR_EMPTY'));
      }

      // left to right wrap layout algorithm
      layout.addAlgorithm('left-right-wrap', {
        sort: (items) => {
          items.sort((a, b) => {
            const aName = a.meta.img._filepath;
            const bName = b.meta.img._filepath;
            return (Number(aName.match(/(\d+)/g)[0]) - Number((bName.match(/(\d+)/g)[0])));
          });
          return items;
        },
        placeItems: (items) => {
          let x = 0;
          let y = 0;
          items.forEach((item, i) => {
            item.x = x;
            item.y = y;
            if ((i + 1) % 4 === 0) {
              y += item.height;
              x = 0;
            } else {
              x += item.width;
            }
          });
          return items;
        },
      });

      // TODO: SAVE COORDINATE INFORMATION TO SOME PLACE
      const result: any = await generateImages(srcArray);
      // coordinates = result.coordinates;
      // TODO: CHECK IF FILE EXIST
      await fse.writeFile(path.join(path.resolve(__dirname), rootPath, outputName), result.image);
      resolve(path.join(path.resolve(__dirname), rootPath, outputName));
    } catch (e) {
      reject(e);
    } finally {
      // TODO: NEED TO CLEAN UP FOLDER
      console.log('Finally');
    }
  });
};

export const helper = async (req, res) => {
  const root = req.body.root;
  const name = req.body.outputName;
  try {
    const output = await spriteSheetsGenerator(root, name);
    console.log('Success?');
    console.log(output);
  } catch (e) {
    console.log(e);
    console.log('Failed?');
  }
};

export default helper;
