# [S3 Bucket Policy for static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html#example-bucket-policies-use-case-2)
- JSON policy 
```
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"AddPerm",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::examplebucket/*"]
    }
  ]
}
```
# Bucket creation from command line 
- `aws s3api create-bucket --bucket newcenturymotors-dev --generate-cli-skeleton 
`aws s3api create-bucket --region us-east-1 --create

# How to handle the redirect?
## Virtual Hosting of Buckets
>If you have a registered domain, you can add a DNS CNAME entry to point to the Amazon S3 website endpoint. For example, if you have registered domain, www.example-bucket.com, you could create a bucket www.example-bucket.com, and add a DNS CNAME record that points to www.example-bucket.com.s3-website-<region>.amazonaws.com. All requests to http://www.example-bucket.com are routed to www.example-bucket.com.s3-website-<region>.amazonaws.com. For more information, see [Virtual Hosting of Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html).