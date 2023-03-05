import json
import shutil

def loader(source: str):
    print(source)
    return """
export default ({ id, props, state }) => {
  %s
}
"""%source

path_of_the_directory = ['./prepare/src', './prepare/lib']
# ext = ('.rcssm.js')

script_tag = """    <script type="module" src="%s"></script>\n"""

with open("./meta.json") as meta_fh:
    outputs = json.load(meta_fh)["outputs"]

    html = ""
    with open("public/index.html") as html_fh:
        html = html_fh.read()

    with open("./dist/index.html", "w") as html_fh:
        scripts = ""
        for file in outputs:
            with open(file) as output_fh:
                file = file.replace("dist/", "")
                scripts += script_tag%(f"./{file}")
        html_fh.write(html%scripts)

# for pathd in path_of_the_directory:
#     for path, dirc, files in os.walk(pathd):
#         for name in files:
#             if name.endswith(ext):
#                 fpath = f"{path}/{name}"
#                 print(fpath)
#                 with open(fpath) as f_read:
#                     source = f_read.read()
#                     with open(fpath, 'w') as f_write:
#                         f_write.write(loader(source))