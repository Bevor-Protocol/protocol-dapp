// describe("User Creation", () => {
//   const address = "0x371dD800749329f81Ca39AFD856f90419C62Be15";
//   beforeEach(() => {
//     cy.visit(`/`);
//     cy.request({
//       method: "POST",
//       url: "http://localhost:3000/api/mock", // Create a backend endpoint for mock login
//     }).then((response) => {
//       console.log(response);
//       const { cookie } = response.body;
//       // // Manually set the cookie if not automatically handled
//       cy.setCookie("siwe", cookie as string, {
//         httpOnly: false,
//         hostOnly: false,
//       });
//     });
//     cy.getCookie("siwe").should("exist");
//   });
//   it("can create user", () => {
//     cy.request({
//       method: "GET",
//       url: "http://localhost:3000/api/mock",
//     }).then((response) => {
//       console.log(response);
//     });
//     cy.visit(`/users/${address}`);
//     // cy.getCookie("siwe").should("exist");
//     cy.contains("Welcome to Bevor! Let`s create your profile");
//   });
// });
