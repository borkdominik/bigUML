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
package com.eclipsesource.uml.glsp.old.diagram.object_diagram;

public class ObjectModelServerAccess {
   /*-
   // ================== CONTENT =================
   
   /*
    * OBJECT
    *
   public CompletableFuture<Response<String>> addObject(final UmlModelState modelState,
      final Optional<GPoint> newPosition) {
      CCompoundCommand addObjectCompoundCommand = AddObjectCommandContribution
         .create(newPosition.orElse(GraphUtil.point(0, 0)));
      return this.edit(addObjectCompoundCommand);
   }
   
   public CompletableFuture<Response<String>> removeObject(final UmlModelState modelState,
      final NamedElement objectToRemove) {
   
      String semanticProxyUri = getSemanticUriFragment(objectToRemove);
      CCompoundCommand compoundCommand = RemoveClassCommandContribution.create(semanticProxyUri);
      return this.edit(compoundCommand);
   }
   
   public CompletableFuture<Response<String>> setObjectName(final UmlModelState modelState,
      final InstanceSpecification objectToRename, final String newName) {
   
      CCommand setObjectNameCommand = SetObjectNameCommandContribution.create(getSemanticUriFragment(objectToRename),
         newName);
      return this.edit(setObjectNameCommand);
   }
   
   /*
    * ATTRIBUTE
    *
   public CompletableFuture<Response<String>> addAttribute(final UmlModelState modelState,
      final Class parentClass) {
   
      CCommand addAttributeCommand = AddAttributeCommandContribution.create(getSemanticUriFragment(parentClass));
      return this.edit(addAttributeCommand);
   }
   
   public CompletableFuture<Response<String>> setAttribute(final UmlModelState modelState,
      final Property attributeToRename, final String newName, final String newType, final String newBounds) {
   
      CCommand setPropertyNameCommand = SetAttributeCommandContribution
         .create(getSemanticUriFragment(attributeToRename), newName, newType, newBounds);
      return this.edit(setPropertyNameCommand);
   }
   
   /*
    * LINK
    *
   public CompletableFuture<Response<String>> addLink(final UmlModelState modelState,
      final Class sourceClass, final Class targetClass) {
      CCompoundCommand addLinkCompoundCommand = AddLinkCommandContribution
         .create(getSemanticUriFragment(sourceClass), getSemanticUriFragment(targetClass));
      return this.edit(addLinkCompoundCommand);
   }
   */
}
