export class User {
  constructor({
    id = null,
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    profilePicture = null,
    role = 'student',
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.profilePicture = profilePicture;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  get fullName() {
    return ${'$'}{this.firstName} {this.lastName}.trim();
  }
  isAdmin() {
    return this.role === 'admin';
  }
  isStudent() {
    return this.role === 'student';
  }
}
export default User;
