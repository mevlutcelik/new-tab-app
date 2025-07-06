import fs from "fs/promises"

const manifestPath = "./manifest.json"

function incrementPatchVersion(version) {
  const parts = version.split(".").map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error("Version format must be x.y.z")
  }
  parts[2] += 1 // patch arttır
  return parts.join(".")
}

async function main() {
  try {
    const manifestRaw = await fs.readFile(manifestPath, "utf-8")
    const manifest = JSON.parse(manifestRaw)
    
    if (!manifest.version) {
      throw new Error("manifest.json içinde version bulunamadı")
    }

    manifest.version = incrementPatchVersion(manifest.version)

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8")

    console.log(`Manifest version updated to ${manifest.version}`)
  } catch (err) {
    console.error("Version güncellenirken hata:", err)
    process.exit(1)
  }
}

main()
