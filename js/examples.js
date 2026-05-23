export const EXAMPLES = {
    stack: `
// Stack Example
gravity(0, 500)

// Ground
rect(50, 500, 700, 50)

// Pyramidish
rect(300, 450, 50, 50)
rect(360, 450, 50, 50)
rect(420, 450, 50, 50)

rect(330, 390, 50, 50)
rect(390, 390, 50, 50)

rect(360, 330, 50, 50)
`,
    rain: `
// Rain Example
gravity(0, 200)

// Slanted floors
rect(100, 200, 300, 20)
rect(400, 400, 300, 20)

// Rain drops
circle(150, 0, 10)
circle(180, -50, 10)
circle(210, -100, 10)
circle(240, -150, 10)
circle(500, -200, 15)
circle(530, -250, 15)
print(123)
`,

    test: `
    
gravity(0, 200)

circle(400, -100, 15)
rect(300, 200, 500, 9)

`,

    gravity: `

gravity(200, 500)

circle(500, 200, 20)
rect(500, 300, 100, 20)

`
};
