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
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.element;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.GModelContext;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.GCContainer;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.cdk.GComponent;

public class GCContainerElement implements GCContainer {
   protected final EObject source;
   protected final GModelContext context;
   protected GModelElement rootGModel;
   protected GModelElement childrenGModel;

   protected final LinkedList<GComponent> children;

   public GCContainerElement(final GModelContext context, final EObject source) {
      this(context, source, null);
   }

   public GCContainerElement(final GModelContext context, final EObject source, final GModelElement gmodelRoot) {
      super();
      this.context = context;
      this.source = source;
      this.rootGModel = gmodelRoot;
      this.childrenGModel = gmodelRoot;
      this.children = new LinkedList<>();
   }

   protected Optional<String> getCssIdentifier() { return Optional.empty(); }

   public GModelElement getRootGModel() { return rootGModel; }

   /**
    * Also sets the children gmodel to the root model
    *
    * @param element
    */
   public void assignRootGModel(final GModelElement element) {
      this.rootGModel = element;
      setChildrenGModel(element);
   }

   public GModelElement getChildrenGModel() { return childrenGModel; }

   public void setChildrenGModel(final GModelElement element) { this.childrenGModel = element; }

   @Override
   public List<GComponent> getChildren() { return children; }

   protected List<GComponent> getAssignableChildren() {
      return children.stream().filter(c -> {
         // Do not add empty containers
         if (c instanceof GCContainer) {
            var container = (GCContainer) c;
            return container.getChildren().size() > 0;
         }

         return true;
      }).collect(Collectors.toList());
   }

   @Override
   public void addAll(final Collection<GComponent> children) {
      this.children.addAll(children);
   }

   @Override
   public GModelElement buildGModel() {
      if (rootGModel == null) {
         throw new IllegalStateException("Root GModelElement is null. Did you provide it?");
      }

      getCssIdentifier().ifPresent(css -> rootGModel.getCssClasses().add(css));

      childrenGModel.getChildren()
         .addAll(getAssignableChildren().stream().map(c -> c.buildGModel()).collect(Collectors.toList()));

      return rootGModel;
   }
}
