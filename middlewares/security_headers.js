import helmet from 'helmet';

// Basic security headers using Helmet with some common configurations
const securityHeaders = () => {
  return [
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"], // Add other trusted script sources if needed
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles if necessary, or specify sources
        imgSrc: ["'self'", "data:"], // Allow data URIs for images
        connectSrc: ["'self'"], // Specify backend API endpoints if different
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    }),
    helmet.dnsPrefetchControl(),
    helmet.expectCt({
      maxAge: 86400,
      // enforce: true, // Uncomment to enforce Certificate Transparency
      // reportUri: "https://example.com/report-ct", // Optional: specify a report URI
    }),
    helmet.frameguard({ action: 'deny' }), // Or 'sameorigin' if you use iframes from the same origin
    helmet.hidePoweredBy(),
    helmet.hsts({
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true, // Submit your site to the HSTS preload list: hstspreload.org
    }),
    helmet.ieNoOpen(),
    helmet.noSniff(),
    helmet.originAgentCluster(),
    helmet.permittedCrossDomainPolicies(),
    helmet.referrerPolicy({ policy: 'no-referrer' }), // Or other policies like 'same-origin', 'strict-origin-when-cross-origin'
    helmet.xssFilter(),
  ];
};

export default securityHeaders;