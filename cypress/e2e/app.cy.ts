describe("Navigation", () => {
  it("navigates to leaderboard page, renders", () => {
    cy.visit("/");
    cy.get('nav a[href*="/leaderboard"]').click();
    cy.url().should("include", "/leaderboard");
    cy.get("div.leaderboard").should("exist");
  });

  it("navigates to audits page, renders", () => {
    cy.visit("/");
    cy.get('nav a[href*="/audits"]').click();
    cy.url().should("include", "/audits");
    cy.contains("Audits");
  });

  it("menu dropdown works", () => {
    cy.visit("/");
    cy.get("nav").children("div").first().find("div.relative").last().click();
    cy.get("nav")
      .children("div")
      .first()
      .find("div.relative")
      .children("div.absolute")
      .should("exist");

    cy.clickOutside();
    cy.get("nav")
      .children("div")
      .first()
      .find("div.relative")
      .children("div.absolute")
      .should("not.exist");
  });
});
