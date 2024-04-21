# AWS CDK Constructs

## SimpleSecureMavenRepositoryTemplateStack + Construct

This constructs create a cloudfront distribution pointing to a secured s3 bucket.

Use the cloudfront endpoint to download the repo and the s3 bucket to directly upload the build.

### Maven configuration for uploading

deploy command

```
mvn deploy -DaltDeploymentRepository=repository_id::default::s3://bucket_key/ -Daws.accessKeyId=${ACCESS_KEY} -Daws.secretKey=${SECRET_KEY}
```

pom example

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example.java</groupId>
    <artifactId>ExampleUpload</artifactId>
    <version>1.0</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <compiler-plugin.version>3.3.1</compiler-plugin.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <profiles>
        <profile>
            <id>deploy-profile</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <repositories>
                <repository>
                    <id>repository_id</id>
                    <url>s3://bucket_key/</url>
                </repository>
            </repositories>
        </profile>
    </profiles>

    <build>

        <plugins>
            <plugin>
                <!-- Compiler plugin configuration -->
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>${maven.compiler.source}</source>
                    <target>${maven.compiler.target}</target>
                </configuration>
            </plugin>
            <!-- Including source and Javadoc packaging -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>${compiler-plugin.version}</version>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>3.6.3</version>
                <executions>
                    <execution>
                        <id>attach-javadocs</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
        <extensions>
            <extension>
                <groupId>com.github.ehsaniara</groupId>
                <artifactId>maven-repository-aws-s3</artifactId>
                <version>1.2.11</version>
            </extension>
        </extensions>
    </build>

    <distributionManagement>
        <repository>
            <id>repository_id</id>
            <name>Your repository name</name>
            <url>s3://bucket_key/</url>
        </repository>
    </distributionManagement>

</project>
```

### Maven configuration for downloading

pom example

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example.import</groupId>
    <artifactId>TestMavenImport</artifactId>
    <version>1.0</version>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <repositories>
        <repository>
            <id>repository_id</id>
            <url>https://id.cloudfront.net/</url>
        </repository>
    </repositories>
    <dependencies>
        <dependency>
            <groupId>libary_group_id</groupId>
            <artifactId>library_artifact_id</artifactId>
            <version>libary_version</version>
        </dependency>
    </dependencies>
</project>
```

## SimpleWebsiteStack + Construct

The construct creates a certificate, s3 bucket and cloudfront distribution. The cloudfront distribution uses origin access identity security; it does not use the static website configuration.

If isSinglePageApplication is true then the cloudfront distribution creates error handling for 404 and 403 to redirect to the SPA.

A hosted zone needs to be created before, so that the IAM certificate can automatically create the cnames to validate it.

The first domain name in the array is the one used as the domain name and the rest as alternate domain names.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npm run bootstrap` should be the first thing to run, only has to be done once
- `npm run liststacks` alias to remember whats the command in cdk to list all the stacks
- `npm run deploysimplewebsite` deploy the simple website stack
- `npm run deploysimplesecuremavenrepo` deploy the maven repo construct
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
