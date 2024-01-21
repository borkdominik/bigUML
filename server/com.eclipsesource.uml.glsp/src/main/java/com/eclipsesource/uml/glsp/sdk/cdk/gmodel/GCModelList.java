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
package com.eclipsesource.uml.glsp.sdk.cdk.gmodel;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.graph.GModelElement;

import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBuildable;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBuildableCollectionProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCBuildableProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;

public class GCModelList<TSource extends EObject, TGModel extends GModelElement>
   extends GModelComponent<TSource, TGModel>
   implements Collection<GCProvider> {
   private static Logger LOGGER = LogManager.getLogger(GCModelList.class.getSimpleName());

   protected ArrayList<GCProvider> children = new ArrayList<>();
   protected Optional<GModelElement> childrenGModel;

   public GCModelList(final GModelContext context, final TSource source) {
      this(context, source, null);
   }

   public GCModelList(final GModelContext context, final TSource source, final TGModel gmodelRoot) {
      super(context, source, gmodelRoot);
      this.childrenGModel = Optional.ofNullable(gmodelRoot);
   }

   /**
    * Also sets the children gmodel to the root model.
    * The children will be always added to the children GModel.
    *
    * @param element
    */
   public void assignRootGModel(final TGModel element) {
      this.rootGModel = element;
      setChildrenGModel(element);
   }

   public GModelElement getChildrenGModel() { return childrenGModel.orElse(rootGModel); }

   public void setChildrenGModel(final GModelElement element) { this.childrenGModel = Optional.ofNullable(element); }

   @Override
   public boolean isVisible() { return getAssignableChildrenSize() > 0; }

   protected Optional<GModelElement> createChildrenGModel() {
      return Optional.empty();
   }

   public List<GCProvider> getAssignableChildren() {
      return children.stream().filter(c -> {
         return c.isVisible();
      }).collect(Collectors.toList());
   }

   public int getAssignableChildrenSize() { return this.getAssignableChildren().size(); }

   @Override
   protected void extendGModel(final GModelElement rootGModel) {
      assertChildrenGModelIsSet(rootGModel);
      assignChildrenToGModel(rootGModel);
   }

   protected void assertChildrenGModelIsSet(final GModelElement rootGModel) {
      if (childrenGModel.isEmpty() && createChildrenGModel().isPresent()) {
         var child = createChildrenGModel().get();
         setChildrenGModel(child);
         getRootGModel().getChildren().add(child);
      }
   }

   protected void assignChildrenToGModel(final GModelElement rootGModel) {
      getAssignableChildren().forEach(c -> {
         assignChildToGModel(getChildrenGModel(), c);
      });
   }

   protected void assignChildToGModel(final GModelElement gmodel, final GCProvider provider) {
      if (provider instanceof GCBuildable) {
         var e = (GCBuildable<?>) provider;
         gmodel.getChildren().add(e.provideGModel());
      } else if (provider instanceof GCBuildableCollectionProvider) {
         var e = (GCBuildableCollectionProvider<?>) provider;
         gmodel.getChildren()
            .addAll(e.provideAll().stream().map(p -> p.provideGModel()).collect(Collectors.toList()));
      } else if (provider instanceof GCBuildableProvider) {
         var e = (GCBuildableProvider<?>) provider;
         gmodel.getChildren()
            .add(e.provide().provideGModel());
      } else {
         LOGGER.error(
            String.format("Provided class %s was not handled.", provider.getClass().getSimpleName()));
      }
   }

   public boolean add(final GModelElement e) {
      return children.add(new GCModelElement<EObject, GModelElement>(context, origin, e));
   }

   @Override
   public boolean add(final GCProvider e) {
      return children.add(e);
   }

   public boolean addAllGModels(final Collection<? extends GModelElement> c) {
      c.forEach(e -> {
         children.add(new GCModelElement<EObject, GModelElement>(context, origin, e));
      });

      return true;
   }

   @Override
   public boolean addAll(final Collection<? extends GCProvider> c) {
      return children.addAll(c);
   }

   @Override
   public void clear() {
      children.clear();
   }

   @Override
   public boolean contains(final Object o) {
      return children.contains(o);
   }

   @Override
   public boolean containsAll(final Collection<?> c) {
      return children.containsAll(c);
   }

   @Override
   public boolean isEmpty() { return children.isEmpty(); }

   @Override
   public Iterator<GCProvider> iterator() {
      return children.iterator();
   }

   @Override
   public boolean remove(final Object o) {
      return children.remove(o);
   }

   @Override
   public boolean removeAll(final Collection<?> c) {
      return children.removeAll(c);
   }

   @Override
   public boolean retainAll(final Collection<?> c) {
      return children.retainAll(c);
   }

   @Override
   public int size() {
      return children.size();
   }

   @Override
   public Object[] toArray() {
      return children.toArray();
   }

   @Override
   public <T> T[] toArray(final T[] a) {
      return children.toArray(a);
   }

}
