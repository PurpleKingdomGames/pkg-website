{
  description = "pkg-website-dev";

  inputs = {
    nixpkgs.url = github:nixos/nixpkgs/nixpkgs-unstable;
    flake-utils.url = github:numtide/flake-utils;
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        commonInputs = with pkgs; [
          nodejs
          yarn
          nodePackages_latest.http-server
        ];

      in
      {
        devShells.default = pkgs.mkShell {
          name = "pkg-website-dev-shell";
          buildInputs = commonInputs;
          shellHook = ''
            yarn install
          '';
        };
      }
    );

}
