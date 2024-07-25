import { blurFilter, observe, config } from "./content"

describe("blur", () => {
  test("blur a secret", () => {
    // Define our document (web page) that we will test against
    document.body.innerHTML = `
    <div id="testDiv">
      "My secret"
    </div>`
    // Set value to blur
    config.item = "secret"
    // Start observing the document.
    observe()
    // Make sure the element is blurred as expected
    const testDiv = document.getElementById("testDiv") as HTMLInputElement
    expect(testDiv).toBeDefined()
    expect(testDiv.style.filter).toBe(blurFilter)
  })
})
