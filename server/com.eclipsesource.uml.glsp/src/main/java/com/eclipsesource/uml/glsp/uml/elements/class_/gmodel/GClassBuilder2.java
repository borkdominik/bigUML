/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel;

import java.util.List;
import java.util.stream.Collectors;

import org.eclipse.emf.common.util.EList;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Operation;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.GCContainer;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.GComponent;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.builder.GModelComponentBuilder;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.element.GCContainerElement;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.components.header.GCHeader;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.components.label.GCNameLabel;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.components.list.GCList;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.components.list.GCListItem;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.properties.GBorderProperty;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.properties.GPositionProperty;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.properties.GPropertyCollection;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.properties.GSizeProperty;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGCompartmentBuilder;
import com.eclipsesource.uml.glsp.uml.gmodel.builder.UmlGLayoutOptions;

public class GClassBuilder2<TSource extends Class> extends GModelComponentBuilder<TSource, GNode> {

   protected final String type;

   public GClassBuilder2(final GModelContext context, final TSource source, final String type) {
      super(context, source);
      this.type = type;
   }

   protected List<Property> attributes(final TSource source) {
      return source.getOwnedAttributes().stream()
         .filter(p -> p.getAssociation() == null)
         .collect(Collectors.toList());
   }

   protected EList<Operation> operations(final TSource source) {
      return source.getOwnedOperations();
   }

   protected boolean hasVisibleBody() {
      return attributes(source).size() > 0 || operations(source).size() > 0;
   }

   @Override
   protected GNode createRootGModel() {
      return new GNodeBuilder(type)
         .id(context.idGenerator().getOrCreateId(source))
         .layout(GConstants.Layout.VBOX)
         .layoutOptions(new UmlGLayoutOptions().clearPadding())
         .addArgument("build_by", "gbuilder")
         .addCssClass(CoreCSS.NODE)
         .build();
   }

   @Override
   protected GPropertyCollection getRootGModelProperties() {
      return GPropertyCollection.of(new GBorderProperty(), new GPositionProperty(context), new GSizeProperty(context));
   }

   @Override
   protected GCContainer createRootComponent() {
      var root = new GCContainerElement(context, source, new UmlGCompartmentBuilder<>(source, context)
         .withVBoxLayout()
         .addLayoutOptions(new UmlGLayoutOptions()
            .clearPadding()
            .hGrab(true)
            .vGrab(true)
            .hAlign(GConstants.HAlign.LEFT))
         .build());

      root.addAll(List.of(createComponentHeader(), createComponentBody()));

      return root;
   }

   protected GComponent createComponentHeader() {
      var headerOptions = new GCHeader.Options();
      headerOptions.fullHeight = !hasVisibleBody();
      var header = new GCHeader(context, source, headerOptions);

      var nameOptions = new GCNameLabel.Options(source.getName());

      if (source.isAbstract()) {
         nameOptions.css.addAll(List.of(CoreCSS.FONT_BOLD, CoreCSS.FONT_ITALIC));
      } else {
         nameOptions.css.addAll(List.of(CoreCSS.FONT_BOLD));
      }

      header.addAll(List.of(new GCNameLabel(context, source, nameOptions)));

      return header;
   }

   protected GComponent createComponentBody() {
      var options = new GCList.Options();
      options.dividerBeforeGroup = true;
      var list = new GCList(context, source, options);

      list.addAll(attributesAsComponents());
      list.addAll(operationsAsComponents());

      return list;
   }

   protected List<GComponent> attributesAsComponents() {
      var attributes = attributes(source);

      if (attributes.size() > 0) {
         return attributes.stream()
            .map(e -> context.gmodelMapHandler().handle(e))
            .map(e -> new GCListItem(context, source, e))
            .collect(Collectors.toList());
      }

      return List.of();
   }

   public List<GComponent> operationsAsComponents() {
      var operations = operations(source);

      if (operations.size() > 0) {
         return operations.stream()
            .map(e -> context.gmodelMapHandler().handle(e))
            .map(e -> new GCListItem(context, source, e))
            .collect(Collectors.toList());
      }

      return List.of();
   }
}
