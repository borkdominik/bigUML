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
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GCompartment;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GCompartmentBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.ActivityGroup;
import org.eclipse.uml2.uml.ActivityPartition;
import org.eclipse.uml2.uml.InterruptibleActivityRegion;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class ActivityDiagramGroupNodeFactory extends AbstractGModelFactory<ActivityGroup, GNode> {

   private final DiagramFactory parentFactory;

   public ActivityDiagramGroupNodeFactory(final UmlModelState modelState, final DiagramFactory parentFactory) {
      super(modelState);
      this.parentFactory = parentFactory;
   }

   @Override
   public GNode create(final ActivityGroup activityGroup) {
      System.out.println("REACHES IF");
      if (activityGroup instanceof ActivityPartition) {
         System.out.println("GOES INTO IF");
         return createPartition((ActivityPartition) activityGroup);
      } else if (activityGroup instanceof InterruptibleActivityRegion) {
         return create((InterruptibleActivityRegion) activityGroup);
      }
      return null;
   }

   protected GNode createPartition(final ActivityPartition partition) {
      System.out.println("ENTERS CREATE FACTORY - PARTITION");
      List<EObject> children = new ArrayList<>(partition.getOwnedElements());
      children.addAll(partition.getNodes());

      GNodeBuilder b = new GNodeBuilder(Types.PARTITION) //
            .id(toId(partition)) //
            .layout(GConstants.Layout.VBOX) //
            .addCssClass(CSS.NODE) //
            .add(buildHeader(partition));
      //.add(createLabeledChildrenCompartment(children, partition));

      applyShapeData(partition, b);
      return b.build();
   }

   protected GNode create(final InterruptibleActivityRegion region) {
      List<EObject> children = new ArrayList<>(region.getOwnedElements());
      children.addAll(region.getNodes());

      GNodeBuilder b = new GNodeBuilder(Types.INTERRUPTIBLEREGION) //
            .id(toId(region)) //
            .layout(GConstants.Layout.VBOX) //
            .addCssClass(CSS.NODE)
            .add(createLabeledChildrenCompartment(children, region));

      applyShapeData(region, b);
      return b.build();
   }

   protected GCompartment buildHeader(final ActivityGroup activityGroup) {
      return new GCompartmentBuilder(Types.COMPARTMENT_HEADER) //
            .layout("hbox") //
            .id(toId(activityGroup) + "_header") //
            .add(new GLabelBuilder(Types.LABEL_NAME) //
                  .id(toId(activityGroup) + "_header_label").text(activityGroup.getName()) //
                  .build()) //
            .build();
   }

   protected void applyShapeData(final ActivityGroup activityGroup, final GNodeBuilder builder) {
      modelState.getIndex().getNotation(activityGroup, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         }
         if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected GCompartment createLabeledChildrenCompartment(final Collection<? extends EObject> children,
                                                           final ActivityGroup parent) {
      return new GCompartmentBuilder(Types.COMP) //
            .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX) //
            .layoutOptions(new GLayoutOptions() //
                  .hAlign(GConstants.HAlign.LEFT) //
                  .resizeContainer(true)) //
            .addAll(children.stream() //
                  .map(parentFactory::create)
                  .collect(Collectors.toList()))
            .build();
   }
}
