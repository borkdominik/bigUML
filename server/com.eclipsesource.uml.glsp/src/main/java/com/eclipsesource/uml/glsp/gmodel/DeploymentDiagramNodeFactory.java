package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class DeploymentDiagramNodeFactory extends AbstractGModelFactory<Classifier, GNode> {

   private final DiagramFactory parentFactory;

   public DeploymentDiagramNodeFactory(final UmlModelState modelState, final DiagramFactory parentFactory) {
      super(modelState);
      this.parentFactory = parentFactory;
   }

   @Override
   public GNode create(final Classifier classifier) {
      if (classifier instanceof DeploymentSpecification) {
         return createDeploymentSpecification((DeploymentSpecification) classifier);
      } else if (classifier instanceof Device) {
         return createDevice((Device) classifier);
      } else if (classifier instanceof ExecutionEnvironment) {
         return createExecutionEnvironment((ExecutionEnvironment) classifier);
      } else if (classifier instanceof Node) {
         return createNode((Node) classifier);
      } else if (classifier instanceof Artifact) {
         return createArtifact((Artifact) classifier);
      }
      return null;
   }

   protected GNode createDeploymentSpecification(final DeploymentSpecification deploymentSpecification) {
      GNodeBuilder b = new GNodeBuilder(Types.DEPLOYMENT_SPECIFICATION)
            .id(toId(deploymentSpecification))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .add(buildHeader(deploymentSpecification));

      applyShapeData(deploymentSpecification, b);
      return b.build();
   }

   protected GNode createNode(final Node umlNode) {
      List<EObject> nodeChildren = new ArrayList<>(umlNode.getOwnedElements());

      GNodeBuilder b = new GNodeBuilder(Types.DEPLOYMENT_NODE)
            .id(toId(umlNode))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .add(buildHeader(umlNode))
            .add(createLabeledChildCompartment(nodeChildren, umlNode));

      applyShapeData(umlNode, b);
      return b.build();
   }

   protected GNode createArtifact(final Artifact artifact) {
      List<EObject> artifactChildren = new ArrayList<>(artifact.getNestedArtifacts());

      GNodeBuilder b = new GNodeBuilder(Types.ARTIFACT)
            .id(toId(artifact))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .add(buildHeader(artifact))
            .add(createLabeledChildCompartment(artifactChildren, artifact));

      ArrayList<Classifier> childElements = new ArrayList<>();
      childElements.addAll(artifact.getNestedArtifacts().stream()
            .filter(pe -> (pe instanceof DeploymentSpecification))
            .map(Classifier.class::cast)
            .collect(Collectors.toList()));

      applyShapeData(artifact, b);
      return b.build();
   }

   protected GNode createDevice(final Device device) {
      List<EObject> deviceChildren = new ArrayList<>(device.getOwnedElements());

      GNodeBuilder b = new GNodeBuilder(Types.DEVICE)
            .id(toId(device))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .add(buildHeader(device))
            .add(createLabeledChildCompartment(deviceChildren, device));

      applyShapeData(device, b);
      return b.build();
   }

   protected GNode createExecutionEnvironment(final ExecutionEnvironment executionEnvironment) {
      List<EObject> executionEnvironmentChildren = new ArrayList<>(executionEnvironment.getOwnedElements());

      GNodeBuilder b = new GNodeBuilder(Types.DEVICE)
            .id(toId(executionEnvironment))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE)
            .add(buildHeader(executionEnvironment))
            .add(createLabeledChildCompartment(executionEnvironmentChildren, executionEnvironment));

      applyShapeData(executionEnvironment, b);
      return b.build();
   }

   protected void applyShapeData(final Classifier classifier, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(classifier, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected GCompartment buildHeader(final Node umlNode) {
      return new GCompartmentBuilder(Types.COMPARTMENT_HEADER) //
            .layout("hbox") //
            .id(toId(umlNode) + "_header")
            .add(new GCompartmentBuilder(getType(umlNode)) //
                  //.id(toId(umlNode) + "_header_icon")
                  .build()) //
            .add(new GLabelBuilder(Types.LABEL_NAME) //
                  .id(toId(umlNode) + "_header_label").text(umlNode.getName()) //
                  .build()) //
            .build();
   }

   protected GCompartment buildHeader(final Artifact umlArtifact) {

      GCompartmentBuilder artifactHeader = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.VBOX)
            .id(UmlIDUtil.createHeaderId(toId(umlArtifact)));

      GLabel typeLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlArtifact)) + "_type_header")
            .text("«artifact»")
            .build();
      artifactHeader.add(typeLabel);

      GLabel artifactLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlArtifact)))
            .text(umlArtifact.getName())
            .build();
      artifactHeader.add(artifactLabel);

      return artifactHeader.build();
   }

   protected GCompartment buildHeader(final ExecutionEnvironment umlExecutionEnvironment) {
      GCompartmentBuilder executionEnvironmentHeader = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.VBOX)
            .id(UmlIDUtil.createHeaderId(toId(umlExecutionEnvironment)));

      GLabel typeLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlExecutionEnvironment)) + "_type_header")
            .text("«execution_environment»")
            .build();
      executionEnvironmentHeader.add(typeLabel);

      GLabel executionEnvironmentLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlExecutionEnvironment)))
            .text(umlExecutionEnvironment.getName())
            .build();
      executionEnvironmentHeader.add(executionEnvironmentLabel);

      return executionEnvironmentHeader.build();
   }

   protected GCompartment buildHeader(final Device umlDevice) {
      GCompartmentBuilder deviceHeader = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.VBOX)
            .id(UmlIDUtil.createHeaderId(toId(umlDevice)));

        /*GCompartment deviceIcon = new GCompartmentBuilder(getType(umlDevice))
                .id(UmlIDUtil.createHeaderIconId(toId(umlDevice)))
                .build();
        deviceHeader.add(deviceIcon);*/

      GLabel typeLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlDevice)) + "_type_header")
            .text("«device»")
            .build();
      deviceHeader.add(typeLabel);

      GLabel deviceLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(umlDevice)))
            .text(umlDevice.getName())
            .build();
      deviceHeader.add(deviceLabel);

      return deviceHeader.build();
   }

   protected GCompartment buildHeader(final DeploymentSpecification umlDeploymentSpecification) {
      return new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout("vbox")
            .id(toId(umlDeploymentSpecification) + "_header")
            .add(new GLabelBuilder(Types.LABEL_TEXT)
                  .id(toId(umlDeploymentSpecification) + "_header_text")
                  .text("«deployment spec»")
                  .build())
            .add(new GCompartmentBuilder(Types.COMPARTMENT_HEADER) //
                  .layout("hbox") //
                  /*.add(new GCompartmentBuilder(getType(umlDeploymentSpecification)) //
                          .id(toId(umlDeploymentSpecification) + "_header_icon").build()) //
                  .add(new GLabelBuilder(Types.LABEL_NAME) //
                          .id(toId(umlDeploymentSpecification) + "_header_label").text(umlDeploymentSpecification.getName()) //
                          .build())*/ //
                  .build())
            .build();
   }

   protected GCompartment createLabeledChildCompartment(final Collection<? extends EObject> children,
                                                        final Node parent) {
      return new GCompartmentBuilder(Types.COMP) //
            .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX) //
            .layoutOptions(new GLayoutOptions() //
                  .hAlign(GConstants.HAlign.CENTER) //
                  .resizeContainer(true)) //
            .addAll(children.stream() //
                  .map(parentFactory::create) //
                  .collect(Collectors.toList()))
            .build();
   }

   protected GCompartment createLabeledChildCompartment(final Collection<? extends EObject> children,
                                                        final Artifact parent) {
      return new GCompartmentBuilder(Types.COMP) //
            .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX) //
            .layoutOptions(new GLayoutOptions() //
                  .hAlign(GConstants.HAlign.CENTER) //
                  .resizeContainer(true)) //
            .addAll(children.stream() //
                  .map(parentFactory::create) //
                  .collect(Collectors.toList()))
            .build();
   }

   protected GCompartment createLabeledChildCompartment(final Collection<? extends EObject> children,
                                                        final Device parent) {
      return new GCompartmentBuilder(Types.COMP) //
            .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX) //
            .layoutOptions(new GLayoutOptions() //
                  .hAlign(GConstants.HAlign.CENTER) //
                  .resizeContainer(true)) //
            .addAll(children.stream() //
                  .map(parentFactory::create) //
                  .collect(Collectors.toList()))
            .build();
   }

   protected GCompartment createLabeledChildCompartment(final Collection<? extends EObject> children,
                                                        final ExecutionEnvironment parent) {
      return new GCompartmentBuilder(Types.COMP) //
            .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX) //
            .layoutOptions(new GLayoutOptions() //
                  .hAlign(GConstants.HAlign.CENTER) //
                  .resizeContainer(true)) //
            .addAll(children.stream() //
                  .map(parentFactory::create) //
                  .collect(Collectors.toList()))
            .build();
   }

   protected static String getType(final Classifier classifier) {
      if (classifier instanceof DeploymentSpecification) {
         return Types.ICON_DEPLOYMENT_SPECIFICATION;
      }
      if (classifier instanceof Artifact) {
         return Types.ICON_ARTIFACT;
      }
      if (classifier instanceof ExecutionEnvironment) {
         return Types.ICON_EXECUTION_ENVIRONMENT;
      }
      if (classifier instanceof Device) {
         return Types.ICON_DEVICE;
      }
      if (classifier instanceof Node) {
         return Types.ICON_DEPLOYMENT_NODE;
      }
      if (classifier instanceof Class) {
         return Types.ICON_CLASS;
      }

      return "Classifier not found";
   }

}
