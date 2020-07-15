## Custom Installation Page
#### For Omni App Implementation

Custom Installation page lets the app to get the information that app needs letting developer write code in more traditional HTML, CSS and Javascript.

When it comes to Omni app implementation of Custom Installation page feature, you are likely to see difference in following areas:

1. `iparams.html` being able to render specific to the product. For example, render in Freshsales if app is being installed in Freshsales.
2. Using `client.context.productName` to get the name of the product in which app is being installed.
3. During locally testing your app using `fdk`, app can only run one one product at a time. That product is the one which comes first in the `product` attribute of `manifest.json`file. (👣 Although sounds weird, we will fix this in future releases!!)
4. 
