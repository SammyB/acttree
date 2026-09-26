# Local Apache 2.4 for `npm run test:apache`: serves _site/ with .htaccess enabled,
# on HTTP (80) and HTTPS (443, self-signed) so the HTTPS/canonical-host rules can be tested.
FROM httpd:2.4

RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/* \
 && openssl req -x509 -nodes -newkey rsa:2048 -days 3650 \
      -subj "/CN=localhost" \
      -keyout /usr/local/apache2/conf/server.key \
      -out /usr/local/apache2/conf/server.crt

# Modules the site's .htaccess relies on (filter_module and mime_module are on by default).
RUN sed -i -E 's/^#(LoadModule (rewrite|headers|expires|deflate|ssl|socache_shmcb)_module)/\1/' conf/httpd.conf \
 && echo "Include conf/extra/acttree-test.conf" >> conf/httpd.conf

COPY acttree-test.conf conf/extra/acttree-test.conf
