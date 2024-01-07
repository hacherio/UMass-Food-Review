import fs from 'fs';

const read = () => {
  if (fs.existsSync('management.json')) {
    return JSON.parse(fs.readFileSync('management.json', 'utf8'));
  } else {
    return {};
  }
};

const write = (manage) => {
  fs.writeFileSync('management.json', JSON.stringify(manage));
};

export default {
  read,
  write,
};
