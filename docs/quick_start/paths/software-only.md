# Software only

You have no hardware yet, or you want to learn the flight software before you touch a board. By the end of this page you will have built the flight software, run its tests on your own computer, and found your way around the code.

Before you start, finish [Set up your development environment](../setup/dev-environment.md).

## 1. Run the tests

The project has two sets of tests that run on your computer with no board attached.

Helper tests check small pieces of logic with [GoogleTest](https://github.com/google/googletest):

```sh
make test-unit
```

Component tests build each F Prime component for your computer instead of the board and exercise its commands and ports:

```sh
make test-fprime-ut
```

Both end with a summary such as `100% tests passed`. The first run of `make test-fprime-ut` builds a second copy of F Prime for your computer and takes a few minutes.

!!! note "No simulator yet"
    A software-in-the-loop simulator that runs the whole satellite on your computer is being built in [pull request #635](https://github.com/Open-Source-Space-Foundation/proves-core-reference/pull/635), and the [testing roadmap](https://github.com/Open-Source-Space-Foundation/proves-core-reference/blob/main/docs/plans/testing-roadmap.md) tracks it. Until it lands, the component tests are the closest thing, and a bare flight controller board is the cheapest way to run the real thing. This page will grow a simulator section when it does.

## 2. Find your way around

The code you will read and change lives in one folder:

```
proves-core-reference/
├── PROVESFlightControllerReference/
│   ├── Components/            # one folder per component: Watchdog, ModeManager, ...
│   ├── ReferenceDeployment/   # the topology: which components exist and how they connect
│   └── test/                  # unit tests and integration tests
├── boards/                    # Zephyr board definitions for the V5 flight controllers
├── sequences/                 # command sequences the satellite runs on its own
├── Makefile                   # every command you type starts here
└── lib/                       # F Prime, Zephyr, and other downloaded libraries
```

Each component has a `docs/sdd.md` file, its software design document. The whole set is published at the [component documentation site](https://open-source-space-foundation.github.io/proves-core-reference/). Start with `ModeManager`, `StartupManager`, and `Watchdog`. They decide what the satellite does when it wakes up.

`make help` lists every command the Makefile offers with a one-line description.

## 3. Read the dictionary

Your build produced a dictionary file. It lists every command, telemetry channel, and event the satellite knows about. It is the same file the ground station loads.

```sh
less build-artifacts/zephyr/fprime-zephyr-deployment/dict/ReferenceDeploymentTopologyDictionary.json
```

Search it for `CMD_NO_OP` to find the first command you will send once you have a board.

## 4. Make a small change

A good first change is a new event or a new telemetry channel in an existing component. The F Prime project has a tutorial that does exactly that, the [LED Blinker](https://fprime.jpl.nasa.gov/latest/docs/tutorials-led-blinker/led-blinker/). Our components follow the same pattern.

After you change a `.fpp` file, run `make generate` and then `make build`. After you change a `.cpp` file, `make build` is enough.

Before you commit, run the linters and formatters. The project refuses pull requests that fail them.

```sh
make fmt
```

## Next step

- Got a board? Go to [Flight controller board](flight-controller.md).
- Want to send a pull request? Read [Becoming a contributor](../becoming_contributor.md).
