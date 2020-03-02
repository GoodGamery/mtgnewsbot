#!/bin/bash
set -x
# libssl_conf.so workaround (see https://stackoverflow.com/questions/53355217/genymotion-throws-libssl-conf-so-cannot-open-shared-object-file-no-such-file-o)
export OPENSSL_CONF=/etc/ssl/
node mtgnews --tweet --discord -o "#oncePerDay#"
set +x
