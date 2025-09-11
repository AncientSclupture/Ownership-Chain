#!/usr/bin/env bash
set -e

CANISTER_NAME=backend

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
      hash = "0x123abc";
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 2",
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
      hash = "0x123abc";
    }
  },
  variant { Business },
  variant { Active },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 3",
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
      hash = "0x123abc";
    }
  },
  variant { Business },
  variant { Pending },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 4",
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
      hash = "0x123abc";
    }
  },
  variant { Business },
  variant { Active },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 5",
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
      hash = "0x123abc";
    }
  },
  variant { Business },
  variant { Inactive },
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
      hash = "0x123abc";
    }
  },
  variant { Property },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 2",
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
      hash = "0x123abc";
    }
  },
  variant { Property },
  variant { Active },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 3",
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
      hash = "0x123abc";
    }
  },
  variant { Property },
  variant { Pending },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 4",
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
      hash = "0x123abc";
    }
  },
  variant { Property },
  variant { Active },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 5",
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
      hash = "0x123abc";
    }
  },
  variant { Property },
  variant { Inactive },
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
      hash = "0x123abc";
    }
  },
  variant { Artwork },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 2",
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
      hash = "0x123abc";
    }
  },
  variant { Artwork },
  variant { Active },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 3",
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
      hash = "0x123abc";
    }
  },
  variant { Artwork },
  variant { Pending },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 4",
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
      hash = "0x123abc";
    }
  },
  variant { Artwork },
  variant { Active },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 5",
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
      hash = "0x123abc";
    }
  },
  variant { Artwork },
  variant { Inactive },
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
      hash = "0x123abc";
    }
  },
  variant { Vehicle },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 2",
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
      hash = "0x123abc";
    }
  },
  variant { Vehicle },
  variant { Active },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 3",
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
      hash = "0x123abc";
    }
  },
  variant { Vehicle },
  variant { Pending },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 4",
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
      hash = "0x123abc";
    }
  },
  variant { Vehicle },
  variant { Active },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 5",
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
      hash = "0x123abc";
    }
  },
  variant { Vehicle },
  variant { Inactive },
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
      hash = "0x123abc";
    }
  },
  variant { Equipment },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 2",
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
      hash = "0x123abc";
    }
  },
  variant { Equipment },
  variant { Active },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 3",
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
      hash = "0x123abc";
    }
  },
  variant { Equipment },
  variant { Pending },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 4",
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
      hash = "0x123abc";
    }
  },
  variant { Equipment },
  variant { Active },
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

dfx canister call $CANISTER_NAME createAsset '(
  "Rumah Mewah Jakarta 5",
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
      hash = "0x123abc";
    }
  },
  variant { Equipment },
  variant { Inactive },
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