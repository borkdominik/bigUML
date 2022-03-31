/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.gmodel;

import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GModelElement;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The ClassifierNodeFactory is responsible for creating GNode elements (Elements in the SVG representation)
 * for all Classifiers, which most of the "boxes" in the diagram belong to.
 * In here, you can find methods that are responsible for the display instruction that the client receives for each
 * Model element.
 */
public class UseCaseDiagramNodeFactory extends AbstractGModelFactory<Classifier, GNode> {

   private final LabelFactory labelFactory;

   public UseCaseDiagramNodeFactory(final UmlModelState modelState, final LabelFactory labelFactory) {
      super(modelState);
      this.labelFactory = labelFactory;
   }

   /**
    * Entry point for the rendering process of all classifier nodes
    * <p>
    * Special Notice for Use Case diagram: Comments are not Classifiers, thus the specific create method below must be
    * called directly.
    */
   @Override
   public GNode create(final Classifier classifier) {
      if (classifier instanceof Class && !(classifier instanceof Component)) {
         return createClassNode((Class) classifier);
      } else if (classifier instanceof Package) {
         return createPackage((Package) classifier);
      } else if (classifier instanceof Component) {
         return createComponent((Component) classifier);
      } else if (classifier instanceof Actor) {
         return createActor((Actor) classifier);
      } else if (classifier instanceof UseCase) {
         return createUseCase((UseCase) classifier);
      }

      return null;
   }

   // region specific create methods

   /**
    * creates the GNode for a Class element
    *
    * @param umClass
    * @return
    */
   protected GNode createClassNode(final Class umClass) {
      GNodeBuilder classNodeBuilder = new GNodeBuilder(Types.CLASS)
            .id(toId(umClass))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE);

      applyShapeData(umClass, classNodeBuilder);

      GCompartment classHeader = buildClassHeader(umClass);
      classNodeBuilder.add(classHeader);

      GCompartment classPropertiesCompartment = buildClassPropertiesCompartment(umClass.getAttributes(), umClass);
      classNodeBuilder.add(classPropertiesCompartment);

      return classNodeBuilder.build();
   }

   /**
    * Creates the GNode for a Component element.
    * This also builds the packagedElements (in this case only UseCases) and the owned comments.
    *
    * @param umlComponent
    * @return The GNode that can be added to the graph in the ModelFactory.
    */
   protected GNode createComponent(final Component umlComponent) {
      GNodeBuilder b = new GNodeBuilder(Types.COMPONENT)
            .id(toId(umlComponent))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE);

      GCompartment classHeader = buildHeaderWithoutIcon(umlComponent);
      b.add(classHeader);

      ArrayList<Element> childElements = new ArrayList<>();

      childElements.addAll(umlComponent.getPackagedElements().stream()
            .filter(pe -> (pe instanceof UseCase))
            .map(Classifier.class::cast)
            .collect(Collectors.toList()));

      childElements.addAll(umlComponent.getOwnedComments());

      GCompartment componentChildCompartment = buildPackageOrComponentChildCompartment(childElements, umlComponent);
      b.add(componentChildCompartment);

      modelState.getIndex().getNotation(umlComponent, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            b.position(GraphUtil.copy(shape.getPosition()));
         }
      });

      return b.build();
   }

   /**
    * Creates the GNode for a Package element.
    * This also builds the packagedElements (in this case UseCases, Actors and Components) and the owned comments.
    *
    * @return The GNode that can be added to the graph in the ModelFactory.
    */
   protected GNode createPackage(final Package umlPackage) {
      GNodeBuilder b = new GNodeBuilder(Types.PACKAGE)
            .id(toId(umlPackage))
            .layout(GConstants.Layout.VBOX)
            .addCssClass(CSS.NODE);

      GCompartment classHeader = buildHeaderWithoutIcon(umlPackage);
      b.add(classHeader);

      ArrayList<Element> childElements = new ArrayList<>();

      childElements.addAll(umlPackage.getPackagedElements().stream()
            .filter(
                  pe -> (pe instanceof Actor || pe instanceof UseCase || pe instanceof Component || pe instanceof Package))
            .map(Classifier.class::cast)
            .collect(Collectors.toList()));

      childElements.addAll(umlPackage.getOwnedComments());

      GCompartment packageChildCompartment = buildPackageOrComponentChildCompartment(childElements, umlPackage);
      b.add(packageChildCompartment);

      applyShapeData(umlPackage, b);

      return b.build();
   }

   /**
    * Creates the GNode for a UseCase element.
    * This also creates the Extension Point compartment of the UseCase if it has Extension Points.
    *
    * @param umlUseCase
    * @return The GNode that can be added to the graph in the ModelFactory.
    */
   protected GNode createUseCase(final UseCase umlUseCase) {
      GNodeBuilder b = new GNodeBuilder(Types.USECASE) //
            .id(toId(umlUseCase)) //
            .layout(GConstants.Layout.VBOX) //
            .addCssClass(CSS.NODE)
            .addCssClass(CSS.ELLIPSE)
            .add(buildHeaderWithoutIcon(umlUseCase));

      if (umlUseCase.getExtensionPoints().size() > 0) {
         GCompartment extensionPointCompartment = buildUsecaseExtensionPointCompartment(umlUseCase);
         b.add(extensionPointCompartment);
      }

      applyShapeData(umlUseCase, b);
      return b.build();
   }

   /**
    * Creates the GNode for an Actor element.
    *
    * @param umlActor
    * @return The GNode that can be added to the graph in the ModelFactory.
    */
   protected GNode createActor(final Actor umlActor) {
      GNodeBuilder b = new GNodeBuilder(Types.ACTOR) //
            .id(toId(umlActor)) //
            .layout(GConstants.Layout.VBOX) //
            .addCssClass(CSS.NODE) //
            .add(buildHeaderWithoutIcon(umlActor));

      applyShapeData(umlActor, b);
      return b.build();
   }

   protected void applyShapeData(final Element element, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(element, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         } else if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected void applyShapeData(final Package classifier, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(classifier, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
      });
   }

   /**
    * Builds the Header compartment containing the name for a Class element.
    *
    * @param classifier
    * @return
    */
   protected GCompartment buildClassHeader(final Classifier classifier) {
      GCompartmentBuilder classHeaderBuilder = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.HBOX)
            .id(UmlIDUtil.createHeaderId(toId(classifier)));

      GCompartment classHeaderIcon = new GCompartmentBuilder(Types.ICON_CLASS)
            .id(UmlIDUtil.createHeaderIconId(toId(classifier))).build();
      classHeaderBuilder.add(classHeaderIcon);

      GLabel classHeaderLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(classifier)))
            .text(classifier.getName()).build();
      classHeaderBuilder.add(classHeaderLabel);

      return classHeaderBuilder.build();
   }

   /**
    * Builds the properties compartment of a Class element.
    *
    * @param properties
    * @param parent
    * @return
    */
   protected GCompartment buildClassPropertiesCompartment(final Collection<? extends Property> properties,
                                                          final Classifier parent) {
      GCompartmentBuilder classPropertiesBuilder = new GCompartmentBuilder(Types.COMP)
            .id(UmlIDUtil.createChildCompartmentId(toId(parent))).layout(GConstants.Layout.VBOX);

      GLayoutOptions layoutOptions = new GLayoutOptions()
            .hAlign(GConstants.HAlign.LEFT)
            .resizeContainer(true);
      classPropertiesBuilder.layoutOptions(layoutOptions);

      List<GModelElement> propertiesLabels = properties.stream()
            .map(labelFactory::createPropertyLabel)
            .collect(Collectors.toList());
      classPropertiesBuilder.addAll(propertiesLabels);

      return classPropertiesBuilder.build();
   }

   /**
    * Builds the Header compartment without adding an icon.
    * This is used for Actors, Components, Packages and UseCases in the Use Case diagram.
    *
    * @param classifier
    * @return
    */
   protected GCompartment buildHeaderWithoutIcon(final NamedElement classifier) {
      GCompartmentBuilder classHeaderBuilder = new GCompartmentBuilder(Types.COMPARTMENT_HEADER)
            .layout(GConstants.Layout.HBOX)
            .id(UmlIDUtil.createHeaderId(toId(classifier)));

      if (classifier instanceof Component) {
         GLabel classHeaderLabel = new GLabelBuilder(Types.LABEL_TEXT)
               .id(UmlIDUtil.createHeaderLabelId(toId(classifier)) + "_prep")
               .text("<<SubSystem>> ").build();
         classHeaderBuilder.add(classHeaderLabel);
      }
      GLabel classHeaderLabel = new GLabelBuilder(Types.LABEL_NAME)
            .id(UmlIDUtil.createHeaderLabelId(toId(classifier)))
            .text(classifier.getName()).build();
      classHeaderBuilder.add(classHeaderLabel);

      return classHeaderBuilder.build();
   }

   /**
    * Builds the child compartment for a Package or Component.
    * This includes rendering the child elements.
    *
    * @param childNodes
    * @param parent
    * @return
    */
   protected GCompartment buildPackageOrComponentChildCompartment(final Collection<Element> childNodes,
                                                                  final EObject parent) {
      GCompartmentBuilder packageElementsBuilder = new GCompartmentBuilder(Types.COMP)
            .id(UmlIDUtil.createChildCompartmentId(toId(parent)))
            .layout(GConstants.Layout.VBOX);

      List<GModelElement> childNodeGModelElements = childNodes.stream()
            .filter(el -> el instanceof Classifier)
            .map(node -> this.create((Classifier) node))
            .collect(Collectors.toList());

      /*childNodeGModelElements.addAll(childNodes.stream()
         .filter(el -> el instanceof Comment)
         .map(node -> this.createComment((Comment) node))
         .collect(Collectors.toList()));*/

      packageElementsBuilder.addAll(childNodeGModelElements);

      return packageElementsBuilder.build();
   }

   /**
    * Builds the Extension Point Compartment of a UseCase.
    * This method should be called when a UseCase has at least one Extension Point.
    *
    * @param parent
    * @return
    */
   protected GCompartment buildUsecaseExtensionPointCompartment(final UseCase parent) {
      GCompartmentBuilder extensionPointBuilder = new GCompartmentBuilder(Types.COMP)
            .id(UmlIDUtil.createChildCompartmentId(toId(parent))).layout(GConstants.Layout.VBOX);

      GLayoutOptions layoutOptions = new GLayoutOptions()
            .hAlign(GConstants.HAlign.LEFT)
            .resizeContainer(true);
      extensionPointBuilder.layoutOptions(layoutOptions);

      GLabel headingLabel = labelFactory.createUseCaseExtensionPointsHeading(parent);
      extensionPointBuilder.add(headingLabel);

      List<GModelElement> extensionPointsLabel = parent.getExtensionPoints().stream()
            .map(labelFactory::createUseCaseExtensionPointsLabel)
            .collect(Collectors.toList());
      extensionPointBuilder.addAll(extensionPointsLabel);

      return extensionPointBuilder.build();
   }

}
