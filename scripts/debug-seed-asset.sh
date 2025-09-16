#!/usr/bin/env bash
set -e

CANISTER_NAME=backend

dfx identity use findway_agent1

# regist user first
dfx canister call $CANISTER_NAME registUser '(
  "agent 1",
  "agent 1 last name",
  "098765431",
  "Indonesia",
  "Jakarta",
  "319128312163",
  variant { IdentityNumber },
  "-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuQ6L/uABtw0uN6MjAGF6
RdNYFhSL/aW5pNbIX80pYycnrun7NT48yHhKHSLjMgP8xedBsw40TjcvkLQboK8B
iDtVrG/f8ewHkZEMHyKKNMFhw0+qKZOk/LKZ9czhzgt5fo33kgutn8uigAtnCL+Z
MwItNDyUJT5XRTjV4pv96/aZoioyhhmUbFmZgdl81OUWwJSXWX8E1onK5JXRoxzV
+6VbHkw20JiO0/s0B8YE/ZksQ0zG/v7rRWnnOg5bA421RZatUt67YzouPiO05tZB
tInqycjYb1zXN2dXw2GMpctBsvy237ndtVl1I8P0thqtGrsCA8zEK5uduqKUkcg6
SwIDAQAB
-----END PUBLIC KEY-----"
)'


dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 1",
  "Villa 2 lantai dengan kolam renang",
  1000,
  100,
  1,
  50,
  1000000,
  record {
    lat = -6.200000;
    long = 106.816666;
    details = vec { "Jl. Sudirman No. 1"; "Jakarta" };
  },
  vec {
    record {
      name = "SHM Sertifikat";
      description = "Sertifikat Hak Milik rumah";
      hash = "JTUgK7NgftIKEgJMmKrcqG6+JYyOkP0voMbJjl45QcUdfaZaJbMvnw1o/oqO1eMRLZa29lbwXIt09Ey+yZAIsuXTxSOmaOeF2Po9y1HrzSnu9kReswrpuY8S8BNyr/yL3Utd/Y9swwUM1nkep2MaZ5jx5nKLZ2mY1Zu/WU5sgAGiTzpbCpPVaDfHbkMIesyYo2ZaxGLg5bAGXebKOOIU3k5bsJT7yWOwkcl3WYtVOhbEVz0z2+o3mq0UQSJsyduEAmQFfM+EFD6LDuO6Wd6/E47mcRby8X/je69Fndq5zynN5YHVbm4CGgjkjXCo0ZI8bMViXVH/LXuhFkXVGANIsw==";
    }
  },
  variant { Business },
  variant { Open },
  record {
    sellSharing = true;
    sellSharingNeedVote = true;
    sellSharingPrice = 5000000;
    needDownPayment = true;
    minDownPaymentPercentage = 20.0;
    downPaymentCashback = 0.2;
    downPaymentMaturityTime = 30;
    paymentMaturityTime = 365;
    ownerShipMaturityTime = 730;
    details = vec { "DP minimal 20%"; "Cashback 5%" };
  }
)'

dfx canister call $CANISTER_NAME createReportAsset '(
  "hallo context",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus vestibulum risus, sed sodales est condimentum id. Aliquam et orci eget mauris ultrices iaculis.",
  "asset_0",
  record {evidencecontent: x1abc091213; hashclarity: null; footPrintFlow: null},
  variant { Scam }
)'