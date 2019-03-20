FROM docker-virtual.artifactory.corp.alleninstitute.org/electronuserland/builder:wine

RUN /usr/sbin/groupadd -g 10513 domain && \
    /usr/sbin/useradd -g domain -m -N -s /bin/bash -u 1257 lisah

COPY generic-entrypoint.sh /usr/local/bin
COPY entrypoint-params /usr/local/bin

RUN ["chown", "lisah", "/usr/local/bin/generic-entrypoint.sh"]
RUN ["chmod", "u+x", "/usr/local/bin/generic-entrypoint.sh"]

# Use the generic entrypoint that deals with UID mappings from dev user to aics_svc* user (only used for dev env)
ENTRYPOINT [ "/usr/local/bin/generic-entrypoint.sh" ]
CMD ["/bin/bash", "-c", "yarn dist-all"]
