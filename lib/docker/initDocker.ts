import Docker from "dockerode";

let docker: Docker | null = null;

const initDocker = () => {
  if (!docker) {
    docker = new Docker();
  }

  return docker;
};

export { initDocker };
