{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-22.11";
    systems.url = "github:nix-systems/default";
    base-images = {
      url = "github:stafftastic/base-images";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.systems.follows = "systems";
    };
  };

  outputs = { self, nixpkgs, systems, base-images }:
  let
    lib = nixpkgs.lib;
    eachSystem = lib.genAttrs (import systems);
    pkgsFor = eachSystem (system: nixpkgs.legacyPackages.${system});
  in {
    devShell = eachSystem (system: pkgsFor.${system}.mkShell {
      buildInputs = with pkgsFor.${system}; [
        nodejs-18_x
      ];
    });
    packages = eachSystem (system: {
      baseImage = base-images.packages.${system}.nodejs18.override {
        extraEnv = [
          "HOST=0.0.0.0"
          "PORT=80"
        ];
      };
    });
  };
}
