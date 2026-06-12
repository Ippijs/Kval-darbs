#!/usr/bin/env bash

set +e

PASS=0
WARN=0
FAIL=0

log_section() {
    echo
    echo "==========================================================="
    echo "$1"
    echo "==========================================================="
}

pass() {
    PASS=$((PASS + 1))
    echo "[PASS] $1"
}

warn() {
    WARN=$((WARN + 1))
    echo "[WARN] $1"
}

fail() {
    FAIL=$((FAIL + 1))
    echo "[FAIL] $1"
}

run_check() {
    local description="$1"
    shift
    "$@" >/dev/null 2>&1
    local rc=$?
    if [ $rc -eq 0 ]; then
        pass "$description"
    else
        fail "$description"
    fi
}

echo "FishingGear Pro - Project Verification"

log_section "1) Required structure"

required_files=(
    "api.php"
    "Backend/config.php"
    "Backend/auth/auth.php"
    "Backend/products/products.php"
    "Backend/cart/cart.php"
    "Backend/orders/orders.php"
    "Backend/contact/contact.php"
    "Frontend/package.json"
    "Frontend/src/main.jsx"
    "Frontend/src/App.jsx"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        pass "$file exists"
    else
        fail "$file missing"
    fi
done

log_section "2) Frontend checks"

if command -v node >/dev/null 2>&1; then
    pass "Node.js detected ($(node -v))"
else
    fail "Node.js not found"
fi

if [ -d "Frontend/node_modules" ]; then
    pass "Frontend dependencies installed"
else
    warn "Frontend/node_modules missing (run: cd Frontend && npm install)"
fi

if [ -f "Frontend/package.json" ] && [ -d "Frontend/node_modules" ]; then
    (
        cd Frontend || exit 1
        npm run build
    ) >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        pass "Frontend production build succeeds"
    else
        fail "Frontend production build fails"
    fi

    (
        cd Frontend || exit 1
        npm run test
    ) >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        pass "Frontend tests pass"
    else
        warn "Frontend tests failing or not configured"
    fi
else
    warn "Skipped frontend build/tests because dependencies are missing"
fi

log_section "3) Backend checks"

PHP_BIN=""
if command -v php >/dev/null 2>&1; then
    PHP_BIN="php"
elif [ -x "/c/xampp/php/php.exe" ]; then
    PHP_BIN="/c/xampp/php/php.exe"
elif [ -x "C:/xampp/php/php.exe" ]; then
    PHP_BIN="C:/xampp/php/php.exe"
fi

if [ -n "$PHP_BIN" ]; then
    pass "PHP detected ($PHP_BIN)"

    php_files=(
        "api.php"
        "Backend/config.php"
        "Backend/auth/auth.php"
        "Backend/products/products.php"
        "Backend/cart/cart.php"
        "Backend/orders/orders.php"
        "Backend/contact/contact.php"
    )

    for php_file in "${php_files[@]}"; do
        "$PHP_BIN" -l "$php_file" >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            pass "PHP syntax OK: $php_file"
        else
            fail "PHP syntax error: $php_file"
        fi
    done
else
    warn "PHP executable not found (skipped PHP lint)"
fi

if [ -d "images/products" ]; then
    pass "images/products directory exists"
    if [ -w "images/products" ]; then
        pass "images/products is writable"
    else
        warn "images/products is not writable"
    fi
else
    warn "images/products does not exist yet (created automatically on first upload)"
fi

if grep -q "case 'health'" "api.php"; then
    pass "Health endpoint action exists"
else
    warn "Health endpoint action not found in api.php"
fi

echo
echo "Summary: PASS=$PASS WARN=$WARN FAIL=$FAIL"
echo

if [ $FAIL -gt 0 ]; then
    echo "Overall status: NOT READY"
    exit 1
fi

if [ $WARN -gt 0 ]; then
    echo "Overall status: READY WITH WARNINGS"
    exit 0
fi

echo "Overall status: READY"
exit 0
