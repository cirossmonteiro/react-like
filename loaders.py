import os

def loader(source: str):
    print(source)
    return """
export default ({ id, props, state }) => {
  %s
}
"""%source

path_of_the_directory = ['./prepare/src', './prepare/lib']
ext = ('.rcssm.js')

for pathd in path_of_the_directory:
    for path, dirc, files in os.walk(pathd):
        for name in files:
            if name.endswith(ext):
                fpath = f"{path}/{name}"
                print(fpath)
                with open(fpath) as f_read:
                    source = f_read.read()
                    with open(fpath, 'w') as f_write:
                        f_write.write(loader(source))