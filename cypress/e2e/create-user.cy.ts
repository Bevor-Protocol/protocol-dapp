describe("User Creation", () => {
  // const address = "0x0000000100000100002";
  // beforeEach(() => {
  //   cy.request({
  //     method: "POST",
  //     url: "http://localhost:3000/api/mock", // Create a backend endpoint for mock login
  //     body: {
  //       address,
  //     },
  //   }).then((response) => {
  //     // Manually set the cookie if not automatically handled
  //     const cookie = response.headers["set-cookie"] as string[];
  //     const [cookieName, cookieValue] = cookie[0].split(";")[0].split("=");
  //     cy.setCookie(cookieName, cookieValue);
  //   });
  //   cy.getCookie("siwe").should("exist");
  // });
  // it("can create user", () => {
  //   cy.getCookies().then((cookies) => {
  //     console.log(cookies);
  //   });
  //   cy.visit(`/users/${address}`);
  //   cy.getCookies().then((cookies) => {
  //     console.log(cookies);
  //   });
  //   cy.getCookie("siwe").should("exist");
  //   // cy.contains(address);
  //   cy.getCookie("siwe").should("exist");
  //   cy.getCookies().then((cookies) => {
  //     console.log(cookies);
  //   });
  //   cy.contains("Welcome to Bevor! Let`s create your profile");
  // });
  // it("can adjust availability", async () => {
  //   const data = new FormData();
  //   data.set("available", "yes");
  //   const user = await userAction.updateUser(data);
  //   expect(user.data?.available).to.equal(true);
  // });
});
