package Database;

public enum Method {
    getApplicants("getApplicants"),
    getImageById("getImageById"),
    getAdminByUserName("getAdminByUserName"),
    createAdminAccount("createAdminAccount"),
    getAdminUserNames("getAdminUserNames"),
    gutenMorgen("gutenMorgen");// it used to ping the BES
    private final String name;

    private Method(String s) {
        name = s;
    }

    public boolean equalsName(String otherName) {
        return name.equals(otherName);
    }

    public String toString() {
        return this.name;
    }
}
