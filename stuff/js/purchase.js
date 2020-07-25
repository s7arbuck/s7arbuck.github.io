async function main() {
    const scriptLoader = url => new Promise(resolve => {
        const script = document.createElement("script")
        script.onload = resolve
        script.src = url
        document.body.append(script)
    })

    window.authcordSoldOut = true

    const scripts = [
        "https://code.jquery.com/jquery-3.4.1.min.js",
        "https://checkout.stripe.com/v2/checkout.js"
    ]

    await Promise.all(scripts.map(scriptLoader))

    const config = {
        stripeApiKey: "pk_live_rvUr8fa4BsPQDmwuGsU5PAxu00o43z9UGh",
        inStockText: "Purchase Now",
        soldOutText: "Out of Stock",
        baseURL: "https://dashboard.ahiddensociety.com",
        price: 5999,
        currency: "usd",
        name: "Hidden Society"
    }

    const handler = StripeCheckout.configure({
        key: config.stripeApiKey,
        locale: "auto",
        token: async (token) => {
            window.authcordSubmitting = true
            purchaseButton.addClass("processing")
            purchaseButton.text("Processing...")
            purchaseButton.attr("disabled", true)

            const request = await fetch(config.baseURL + "/api/dropin/purchase", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    email: token.email,
                    token: token.id,
                    password: search.get("password") || "landingpage"
                })
            }).then(result => result.json())

            window.authcordSubmitting = false

            purchaseButton.removeClass("processing")
            purchaseButton.addClass("soldOut")
            purchaseButton.text("Out of Stock")
            purchaseButton.attr("disabled", false)

            if (request.success) {
                document.location.href = config.baseURL + `/success?license_key=${request.license_key}&name=${request.name}`
            } else {
                document.location.href = config.baseURL + "/sorry"
            }
        }
    })

    const purchaseButton = $(".authcordPurchaseButton")
    const search = new URLSearchParams(document.location.search)

    const stock = await fetch(config.baseURL + `/api/dropin/stock?password=${search.get("password") || "landingpage"}`)
        .then(result => result.json())

    if (stock.success) {
        purchaseButton.addClass( stock.inStock ? "inStock" : "soldOut" )
        purchaseButton.text( stock.inStock ? config.inStockText : config.soldOutText )
        purchaseButton.attr("disabled", !stock.inStock)
        window.authcordSoldOut = !stock.inStock
    } else {
        // Display error
        purchaseButton.addClass("soldOut")
        purchaseButton.text(config.soldOutText)
        purchaseButton.attr("disabled", true)
    }

    purchaseButton.on("click", async (e) => {
        e.preventDefault()
        if (window.authcordSubmitting || window.authcordSoldOut) return

        handler.open({
            name: config.name,
            amount: config.price,
            currency: config.currency,
            description: config.name + " Monthly Subscription"
        })
    })

    window.addEventListener("popstate", handler.close)
}

main()