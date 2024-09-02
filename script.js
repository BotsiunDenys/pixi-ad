const app = new PIXI.Application({
  view: document.getElementById("canvas"),
  width: 320,
  height: 480,
});

function initializeApp() {
  app.stage.removeChildren(); // clearing existing children on initial load

  let cat, hand; // Declare variables in higher scope
  PIXI.Assets.load("images/kitchen.png").then((texture) => {
    const kitchen = new PIXI.Sprite(texture);
    kitchen.x = app.renderer.width / 2;
    kitchen.y = app.renderer.height / 2;
    kitchen.width = app.renderer.width;
    kitchen.height = app.renderer.height;
    kitchen.anchor.set(0.5);

    app.stage.addChild(kitchen);

    // Load dish textures and cover texture
    const dishes = ["cakes.png", "banana.png", "waffles.png"];
    // plates coordinates
    const platePositions = [
      { x: 70, y: 175 },
      { x: 250, y: 175 },
      { x: 160, y: 250 },
    ];

    const dishPromises = dishes.map((dish) =>
      PIXI.Assets.load(`images/${dish}`)
    );
    const coverPromise = PIXI.Assets.load("images/plate.png");
    const resultImages = { fail: "images/fail.png", win: "images/win.png" };

    Promise.all([...dishPromises, coverPromise]).then((results) => {
      const [cakesTexture, bananaTexture, wafflesTexture, coverTexture] =
        results;

      const shuffledPositions = platePositions.sort(() => 0.5 - Math.random()); // setting random position for every dish
      const covers = []; // Array to store covers for later manipulation

      shuffledPositions.forEach((position, index) => {
        const texture = [cakesTexture, bananaTexture, wafflesTexture][index];
        // closer dish is bigger
        const size =
          position.x === 160 && position.y === 250
            ? { width: 130, height: 90 }
            : { width: 110, height: 80 };
        const dish = new PIXI.Sprite(texture);
        dish.width = size.width;
        dish.height = size.height;
        dish.anchor.set(0.5);
        dish.x = position.x;
        dish.y = position.y + 8;
        app.stage.addChild(dish);

        // Create and add the clickable cover
        const cover = new PIXI.Sprite(coverTexture);
        // setting plate cover size based on it's position, the closer is bigger
        const coverSize =
          position.x === 160 && position.y === 250
            ? { width: 160, height: 130 }
            : { width: 136, height: 116 };
        cover.width = coverSize.width;
        cover.height = coverSize.height;
        cover.anchor.set(0.5);
        cover.x = position.x;
        cover.y = position.y;
        cover.interactive = true;
        cover.buttonMode = true;

        // custom property to the cover to identify the dish
        cover.dishType =
          texture === bananaTexture
            ? "banana"
            : texture === cakesTexture
            ? "cakes"
            : "waffles";

        cover.on("pointerdown", () => {
          let resultImage;
          // disabling cover button mode
          covers.forEach((cover) => {
            cover.interactive = false;
            cover.buttonMode = false;
          });

          // if it is banana, sets fail, else - win
          switch (cover.dishType) {
            case "banana":
              resultImage = resultImages.fail;
              break;
            case "cakes":
            case "waffles":
              resultImage = resultImages.win;
              break;
            default:
              return; // No action for unrecognized dish types
          }

          // sprite for the result image
          PIXI.Assets.load(resultImage).then((texture) => {
            const resultSprite = new PIXI.Sprite(texture);
            resultSprite.width = app.renderer.width;
            resultSprite.height = app.renderer.height;
            resultSprite.anchor.set(0.5);
            resultSprite.x = app.renderer.width / 2;
            resultSprite.y = app.renderer.height / 2;
            resultSprite.alpha = 0;

            app.stage.addChild(resultSprite);

            // Animate the cover
            new TWEEN.Tween(cover)
              .to(
                {
                  x: cover.x - 30,
                  y: cover.y - 80,
                  rotation: cover.rotation - Math.PI / 12, // 15 degrees in radians
                },
                300
              )
              .start();

            // Hide cat and hand
            if (cat && hand) {
              // checking if cat and hand are defined
              new TWEEN.Tween(cat)
                .to(
                  {
                    alpha: 0,
                    x: app.renderer.width + 60,
                    y: app.renderer.height + 100,
                  },
                  300
                )
                .start();

              new TWEEN.Tween(hand)
                .to(
                  {
                    alpha: 0,
                    x: app.renderer.width + 60,
                    y: app.renderer.height + 100,
                  },
                  300
                )
                .start();
            }

            setTimeout(() => {
              // Animate the result sprite
              new TWEEN.Tween(resultSprite).to({ alpha: 1 }, 300).start();
            }, 650);

            // Hide all elements and render final scene
            setTimeout(() => {
              app.stage.children.forEach((child) => (child.visible = false));

              // Load and display the final background
              PIXI.Assets.load("images/finalBg.png").then((bgTexture) => {
                const finalBg = new PIXI.Sprite(bgTexture);
                finalBg.width = app.renderer.width;
                finalBg.height = app.renderer.height;
                finalBg.anchor.set(0.5);
                finalBg.x = app.renderer.width / 2;
                finalBg.y = app.renderer.height / 2;
                finalBg.alpha = 0;

                app.stage.addChild(finalBg);

                PIXI.Assets.load("images/girl.png").then((girlTexture) => {
                  const girl = new PIXI.Sprite(girlTexture);
                  girl.width = 178;
                  girl.height = 403;
                  girl.anchor.set(0.5);
                  girl.x = -100;
                  girl.y = 225;
                  girl.alpha = 0;

                  app.stage.addChild(girl);

                  new TWEEN.Tween(girl)
                    .to(
                      {
                        alpha: 1,
                        x: 75,
                      },
                      300
                    )
                    .start();

                  PIXI.Assets.load("images/cat2.png").then(
                    (finalCatTexture) => {
                      const finalCat = new PIXI.Sprite(finalCatTexture);
                      finalCat.width = 217;
                      finalCat.height = 320;
                      finalCat.anchor.set(0.5);
                      finalCat.x = 300;
                      finalCat.y = 320;
                      finalCat.alpha = 0;

                      app.stage.addChild(finalCat);
                      new TWEEN.Tween(finalCat)
                        .to(
                          {
                            alpha: 1,
                            x: 230,
                          },
                          300
                        )
                        .start();

                      PIXI.Assets.load("images/btn.png").then(
                        (buttonTexture) => {
                          const button = new PIXI.Sprite(buttonTexture);
                          button.width = 295;
                          button.height = 98;
                          button.anchor.set(0.5);
                          button.x = app.renderer.width / 2;
                          button.y = app.renderer.height + 50;
                          button.alpha = 0;

                          app.stage.addChild(button);
                          new TWEEN.Tween(button)
                            .to({ alpha: 1, y: 380 }, 300)
                            .start();

                          button.interactive = true;
                          button.buttonMode = true;
                          button.on("pointerdown", () =>
                            alert("You clicked on button")
                          );
                        }
                      );
                      PIXI.Assets.load("images/restart.png").then(
                        (restartTexture) => {
                          const restart = new PIXI.Sprite(restartTexture);
                          restart.width = 40;
                          restart.height = 40;
                          restart.anchor.set(0.5);
                          restart.x = app.renderer.width + 80;
                          restart.y = app.renderer.height + 80;
                          restart.alpha = 0;

                          app.stage.addChild(restart);
                          new TWEEN.Tween(restart)
                            .to(
                              {
                                alpha: 1,
                                y: app.renderer.height - 30,
                                x: app.renderer.width - 30,
                              },
                              300
                            )
                            .start();

                          restart.interactive = true;
                          restart.buttonMode = true;
                          restart.on("pointerdown", () => initializeApp());
                        }
                      );
                    }
                  );
                });

                PIXI.Assets.load("images/logo.png").then((logoTexture) => {
                  const logo = new PIXI.Sprite(logoTexture);
                  logo.width = 170;
                  logo.height = 141;
                  logo.anchor.set(0.5);
                  logo.x = app.renderer.width + 50;
                  logo.y = 50;
                  logo.alpha = 0;

                  app.stage.addChild(logo);

                  new TWEEN.Tween(logo)
                    .to({ alpha: 1, x: app.renderer.width - 90 }, 300)
                    .start();
                });

                // Fade in the final background
                new TWEEN.Tween(finalBg).to({ alpha: 1 }, 300).start();
              });
            }, 2500);
          });
        });

        // Store covers in an array
        covers.push(cover);
        app.stage.addChild(cover);
      });

      // Ensure the cover at position { x: 160, y: 250 } is above all other covers
      const thirdCover = covers.find(
        (cover) => cover.x === 160 && cover.y === 250
      );
      if (thirdCover) {
        app.stage.addChild(thirdCover); // Add it last to make sure it's on top
      }

      // Load hand texture
      setTimeout(() => {
        PIXI.Assets.load("images/hand.png").then((handTexture) => {
          hand = new PIXI.Sprite(handTexture);
          hand.width = 223;
          hand.height = 186;
          hand.anchor.set(1, 0.5);
          hand.alpha = 0;

          // Load cat texture
          PIXI.Assets.load("images/cat.png").then((catTexture) => {
            cat = new PIXI.Sprite(catTexture);
            cat.width = 151;
            cat.height = 207;
            cat.anchor.set(1);
            cat.alpha = 0;

            // Initial positions off-screen
            hand.x = app.renderer.width + 60;
            hand.y = app.renderer.height + 100;
            cat.x = app.renderer.width + 60;
            cat.y = app.renderer.height + 100;

            // Add the hand first so it appears behind the cat
            app.stage.addChild(hand);
            app.stage.addChild(cat);

            // Smoothly fade in the cat and hand
            new TWEEN.Tween(cat)
              .to(
                { alpha: 1, x: app.renderer.width, y: app.renderer.height },
                300
              )
              .start();
            new TWEEN.Tween(hand)
              .to(
                {
                  alpha: 1,
                  x: app.renderer.width - 35,
                  y: app.renderer.height - 100,
                },
                300
              )
              .start();

            // Animate the hand with rotation
            let rotationDirection = 1;
            // rotation amplitude
            const maxRotation = 0;
            const minRotation = -0.1;
            const rotationSpeed = 0.0025; // hand rotation speed

            app.ticker.add(() => {
              hand.rotation += rotationSpeed * rotationDirection;

              if (hand.rotation > maxRotation) {
                hand.rotation = maxRotation;
                rotationDirection = -1; // Reverse direction
              } else if (hand.rotation < minRotation) {
                hand.rotation = minRotation;
                rotationDirection = 1; // Reverse direction
              }

              TWEEN.update();
            });
          });
        });
      }, 500);
    });
  });
}

initializeApp();
